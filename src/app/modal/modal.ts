import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
})
export class Modal {
  @Output() confirmDelete = new EventEmitter<void>();

  onConfirm() {
    this.confirmDelete.emit();

    // 👇 Bootstrap modal close
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}