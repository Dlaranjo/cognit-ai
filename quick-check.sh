#!/bin/bash

# Script para validação rápida (apenas os essenciais)
# Para quando você quer uma verificação rápida antes do commit

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo -e "${BLUE}🚀 COGNIT AI - Verificação Rápida${NC}"
echo "=================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Execute este script na raiz do projeto."
    exit 1
fi

# 1. Linting
print_step "Executando ESLint..."
if npm run lint; then
    print_success "ESLint passou"
else
    print_error "ESLint falhou"
    exit 1
fi

# 2. Type checking
print_step "Verificando tipos TypeScript..."
if npm run typecheck; then
    print_success "TypeScript passou"
else
    print_error "TypeScript falhou"
    exit 1
fi

# 3. Testes
print_step "Executando testes..."
if npm run test; then
    print_success "Testes passaram"
else
    print_error "Testes falharam"
    exit 1
fi

# 4. Build test
print_step "Testando build..."
if npm run build; then
    print_success "Build passou"
else
    print_error "Build falhou"
    exit 1
fi

echo ""
print_success "🎉 Verificação rápida concluída! Pronto para commit."
