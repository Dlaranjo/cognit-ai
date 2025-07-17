import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from '../FileUpload';

describe('FileUpload', () => {
  const createMockFile = (name: string, size: number, type: string) => {
    const file = new File(['content'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  it('should render upload area correctly', () => {
    render(<FileUpload />);
    
    expect(screen.getByText('Arraste arquivos aqui ou clique para selecionar')).toBeInTheDocument();
    expect(screen.getByText('Qualquer tipo de arquivo')).toBeInTheDocument();
    expect(screen.getByText(/Máximo: 5 arquivo/)).toBeInTheDocument();
  });

  it('should show accepted file types when specified', () => {
    render(<FileUpload acceptedTypes={['pdf', 'doc', 'txt']} />);
    
    expect(screen.getByText('Aceitos: pdf, doc, txt')).toBeInTheDocument();
  });

  it('should call onFilesSelect when files are selected', () => {
    const onFilesSelect = vi.fn();
    render(<FileUpload onFilesSelect={onFilesSelect} />);
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(onFilesSelect).toHaveBeenCalledWith([file]);
  });

  it('should validate file size', () => {
    const onFilesSelect = vi.fn();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<FileUpload onFilesSelect={onFilesSelect} maxSizeBytes={1024} />);
    
    const file = createMockFile('large.pdf', 2048, 'application/pdf'); // 2KB, max is 1KB
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(onFilesSelect).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erros de upload:',
      expect.arrayContaining([expect.stringContaining('Arquivo muito grande')])
    );
    
    consoleSpy.mockRestore();
  });

  it('should validate file type', () => {
    const onFilesSelect = vi.fn();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<FileUpload onFilesSelect={onFilesSelect} acceptedTypes={['pdf']} />);
    
    const file = createMockFile('test.txt', 1024, 'text/plain');
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(onFilesSelect).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erros de upload:',
      expect.arrayContaining([expect.stringContaining('Tipo de arquivo não aceito')])
    );
    
    consoleSpy.mockRestore();
  });

  it('should respect max files limit', () => {
    const onFilesSelect = vi.fn();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<FileUpload onFilesSelect={onFilesSelect} maxFiles={2} />);
    
    const files = [
      createMockFile('file1.pdf', 1024, 'application/pdf'),
      createMockFile('file2.pdf', 1024, 'application/pdf'),
      createMockFile('file3.pdf', 1024, 'application/pdf'),
    ];
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files } });
    
    // Should only accept first 2 files
    expect(onFilesSelect).toHaveBeenCalledWith([files[0], files[1]]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erros de upload:',
      expect.arrayContaining([expect.stringContaining('Máximo de 2 arquivos')])
    );
    
    consoleSpy.mockRestore();
  });

  it('should display selected files', () => {
    const files = [
      createMockFile('document.pdf', 1024 * 1024, 'application/pdf'), // 1MB
      createMockFile('text.txt', 2048, 'text/plain'), // 2KB
    ];
    
    render(<FileUpload files={files} />);
    
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('1 MB')).toBeInTheDocument();
    expect(screen.getByText('text.txt')).toBeInTheDocument();
    expect(screen.getByText('2 KB')).toBeInTheDocument();
  });

  it('should call onFileRemove when remove button is clicked', () => {
    const onFileRemove = vi.fn();
    const files = [createMockFile('test.pdf', 1024, 'application/pdf')];
    
    render(<FileUpload files={files} onFileRemove={onFileRemove} />);
    
    const removeButton = screen.getByRole('button', { name: '' }); // X button has no text
    fireEvent.click(removeButton);
    
    expect(onFileRemove).toHaveBeenCalledWith(0);
  });

  it('should handle drag and drop', () => {
    const onFilesSelect = vi.fn();
    render(<FileUpload onFilesSelect={onFilesSelect} />);
    
    const dropZone = screen.getByText('Arraste arquivos aqui ou clique para selecionar').closest('div');
    const file = createMockFile('dropped.pdf', 1024, 'application/pdf');
    
    // Mock dataTransfer
    const mockDataTransfer = {
      files: [file],
    };
    
    fireEvent.drop(dropZone!, { dataTransfer: mockDataTransfer });
    
    expect(onFilesSelect).toHaveBeenCalledWith([file]);
  });

  it('should show active state during drag over', () => {
    render(<FileUpload />);
    
    const dropZone = screen.getByText('Arraste arquivos aqui ou clique para selecionar').closest('div');
    
    fireEvent.dragEnter(dropZone!);
    expect(dropZone).toHaveClass('border-primary', 'bg-primary/5');
    
    fireEvent.dragLeave(dropZone!);
    expect(dropZone).toHaveClass('border-neutral-300');
  });

  it('should be disabled when disabled prop is true', () => {
    const onFilesSelect = vi.fn();
    render(<FileUpload disabled={true} onFilesSelect={onFilesSelect} />);
    
    const dropZone = screen.getByText('Arraste arquivos aqui ou clique para selecionar').closest('div');
    expect(dropZone).toHaveClass('opacity-50', 'cursor-not-allowed');
    
    // Should not respond to file selection when disabled
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('should format file sizes correctly', () => {
    const files = [
      createMockFile('small.txt', 500, 'text/plain'), // 500 Bytes
      createMockFile('medium.pdf', 1536, 'application/pdf'), // 1.5 KB
      createMockFile('large.doc', 2 * 1024 * 1024, 'application/msword'), // 2 MB
    ];
    
    render(<FileUpload files={files} />);
    
    expect(screen.getByText('500 Bytes')).toBeInTheDocument();
    expect(screen.getByText('1.5 KB')).toBeInTheDocument();
    expect(screen.getByText('2 MB')).toBeInTheDocument();
  });

  it('should support single file mode', () => {
    render(<FileUpload multiple={false} />);
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toHaveAttribute('multiple');
  });

  it('should open file dialog when upload area is clicked', () => {
    const mockClick = vi.fn();
    render(<FileUpload />);
    
    // Mock the hidden input click method
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input.click = mockClick;
    
    const uploadArea = screen.getByText('Arraste arquivos aqui ou clique para selecionar').closest('div');
    fireEvent.click(uploadArea!);
    
    expect(mockClick).toHaveBeenCalled();
  });
});