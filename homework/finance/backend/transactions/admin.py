from django.contrib import admin

from homework.finance.backend.transactions.models import Category, Transaction, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'created_at')
    search_fields = ('username', 'email')
    ordering = ('-created_at',)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('title', 'kind', 'amount', 'date', 'user', 'category', 'created_at')
    search_fields = ('title', 'description', 'user__username', 'category__name')
    list_filter = ('kind', 'date', 'category')
    ordering = ('-date',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
