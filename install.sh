#!/bin/bash

# AGS v3 Modern - Installation Script

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

AGS_DIR="$HOME/.config/ags"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   AGS v3 Modern - Installation            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check AGS
print_info "Checking AGS v3..."
if ! command -v ags &> /dev/null; then
    print_error "AGS not found!"
    echo "Install: yay -S aylurs-gtk-shell"
    exit 1
fi
print_success "AGS found"

# Check sassc
print_info "Checking sassc..."
if ! command -v sassc &> /dev/null; then
    print_error "sassc not found!"
    echo "Install: sudo pacman -S sassc"
    exit 1
fi
print_success "sassc found"

# Backup existing config
if [ -d "$AGS_DIR" ]; then
    BACKUP_DIR="$HOME/.config/ags-backup-$(date +%Y%m%d_%H%M%S)"
    print_warning "Backing up existing config to $BACKUP_DIR"
    cp -r "$AGS_DIR" "$BACKUP_DIR"
fi

# Create fresh directory
print_info "Creating AGS directory..."
mkdir -p "$AGS_DIR"

# Copy files
print_info "Copying files..."
cp -r "$SCRIPT_DIR"/* "$AGS_DIR/"
print_success "Files copied"

# Build CSS
print_info "Building CSS..."
cd "$AGS_DIR"
chmod +x build.sh
./build.sh

print_success "CSS compiled"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   Installation Complete! ✓                ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "Structure:"
echo "  ~/.config/ags/"
echo "    ├── app.ts           (entry point)"
echo "    ├── build.sh         (CSS compiler)"
echo "    ├── style/"
echo "    │   ├── style.scss   (source)"
echo "    │   └── style.css    (compiled)"
echo "    └── widgets/refreshMenu/"
echo ""
echo "Next steps:"
echo ""
echo "  1. Start AGS:"
echo "     ${GREEN}ags${NC}"
echo ""
echo "  2. Menu appears at bottom-right"
echo ""
echo "  3. After editing SCSS:"
echo "     ${GREEN}cd ~/.config/ags && ./build.sh${NC}"
echo "     ${GREEN}ags quit && ags${NC}"
echo ""
echo "See MIGRATION_GUIDE.md for full docs"
echo ""

read -p "$(echo -e ${BLUE}?${NC}) Start AGS now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if pgrep -x ags > /dev/null; then
        print_info "Stopping existing AGS..."
        ags quit
        sleep 1
    fi
    
    print_info "Starting AGS..."
    ags &
    sleep 2
    
    if pgrep -x ags > /dev/null; then
        print_success "AGS running! Check bottom-right corner."
    else
        print_error "AGS failed to start"
        echo "Check for errors manually: ags"
    fi
fi

echo ""
