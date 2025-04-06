import { Component, OnInit } from '@angular/core';
import { Category, createNewCategory } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastController } from '@ionic/angular/standalone';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isEditing = false;
  notifications: { type: string, message: string }[] = [];
  private subscription!: Subscription;


  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private toastController: ToastController

  ) {
    this.categoryForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      header: 'Header',
      buttons: [
        {
          icon: 'close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ],
      color:'success',
      message: message,
      //duration: 1500,
      position: 'top',
      swipeGesture: 'vertical' //to swip toast
    });

    await toast.present();
  }

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.notifications.push(notification);
      setTimeout(() => this.notifications.shift(), 3000);
    });

    this.getCategories();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCategories() {
    this.categoryService.loadCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: err => this.notificationService.error('Error loading categories')
    });
  }

  saveCategory() {
    const category = this.categoryForm.value;
    debugger;
    if (category.id === 0) {
      this.categoryService.createCategory(category).subscribe({
        next: res => {
          this.presentToast('Category Created successfully!');
          //this.notificationService.success('Category Created successfully!');
        },
        error: err => this.notificationService.error('Data not saved')
      });
    } else {
      this.categoryService.updateCategory(category).subscribe({
        next: res => {
          this.presentToast('Category updated successfully!');
          //this.notificationService.success('Category updated successfully!');
        },
        error: err => this.notificationService.error('Data not saved')
      });
    }

    this.resetForm();
    this.getCategories();
  }

  editCategory(category: Category) {
    this.categoryForm.patchValue(category);
    this.isEditing = true;
  }

  deleteCategory(id: number) {
    const confirmation = confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.getCategories();
          this.notificationService.success('Category Deleted successfully!');
        },
        error: err => this.notificationService.error('Failed to delete category')
      });
    }
  }

  resetForm() {
    this.categoryForm.reset(createNewCategory());
    this.isEditing = false;
  }
}
