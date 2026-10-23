from django.db import models


class TransactionChoices(models.TextChoices):
    INCOME = 'income', 'Income'
    EXPENSE = 'expense', 'Expense'


class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')

    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, related_name='transactions')
    
    title = models.CharField(max_length=255)
    
    description = models.TextField()
    
    kind = models.CharField(max_length=10, choices=TransactionChoices.choices)
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    date = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.kind.capitalize()} - {self.amount} on {self.date.strftime('%d/%m/%Y %H:%M')}"

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name