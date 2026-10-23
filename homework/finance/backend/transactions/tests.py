from datetime import datetime
from decimal import Decimal

from django.test import TestCase

from .models import Category, User, Transaction

class UserTestCase(TestCase):
    def test_user_creation(self):
        user = User.objects.create(username='testuser', email='testuser@example.com')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'testuser@example.com')


class TransactionTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser', email='testuser@example.com')
    
        self.dateTest = datetime(2026, 10, 23, 12, 0, 0) 

    def test_transaction_creation(self):
        transaction = Transaction.objects.create(
            title='Test Transaction',
            description='This is a test transaction.',
            kind='income',
            amount=Decimal('100.00'),
            date=self.dateTest,
            user=self.user
        )
        self.assertEqual(transaction.title, 'Test Transaction')
        self.assertEqual(transaction.description, 'This is a test transaction.')
        self.assertEqual(transaction.kind, 'income')
        self.assertEqual(transaction.amount, Decimal('100.00'))

    def test_transaction_str_method(self):
        transaction = Transaction.objects.create(
            title='Test Transaction',
            description='This is a test transaction.',
            kind='income',
            amount=Decimal('100.00'),
            date=self.dateTest,
            user=self.user
        )
        expected_str = "Test Transaction - Income - 100.00 on 23/10/2026 12:00"
        self.assertEqual(str(transaction), expected_str)

    def test_transaction_with_category(self):
        category = Category.objects.create(name='Test Category', description='This is a test category.')
        transaction = Transaction.objects.create(
            title='Test Transaction',
            description='This is a test transaction.',
            kind='income',
            amount=Decimal('100.00'),
            date=self.dateTest,
            category=category,
            user=self.user
        )
        self.assertEqual(transaction.category.name, 'Test Category')
        self.assertEqual(transaction.category.description, 'This is a test category.')

    def test_transaction_without_category(self):
        transaction = Transaction.objects.create(
            title='Test Transaction',
            description='This is a test transaction.',
            kind='income',
            amount=Decimal('100.00'),
            date=self.dateTest,
            user=self.user
        )
        self.assertIsNone(transaction.category)

    def test_transaction_category_relationship(self):
        category = Category.objects.create(name='Test Category', description='This is a test category.')
        transaction1 = Transaction.objects.create(
            title='Test Transaction 1',
            description='This is the first test transaction.',
            kind='income',
            amount=Decimal('100.00'),
            date=self.dateTest,
            category=category,
            user=self.user
        )
        transaction2 = Transaction.objects.create(
            title='Test Transaction 2',
            description='This is the second test transaction.',
            kind='expense',
            amount=Decimal('50.00'),
            date=self.dateTest,
            category=category,
            user=self.user
        )
        self.assertEqual(category.transactions.count(), 2)
        self.assertIn(transaction1, category.transactions.all())
        self.assertIn(transaction2, category.transactions.all())

    def test_transaction_category_deletion(self):
        category = Category.objects.create(name='Test Category', description='This is a test category.')
        transaction = Transaction.objects.create(
            title='Test Transaction',
            description='This is a test transaction.',
            kind='income',
            amount=Decimal('100.00'),
            date=self.dateTest,
            category=category,
            user=self.user
        )
        category.delete()
        transaction.refresh_from_db()
        self.assertIsNone(transaction.category)

    def test_transaction_user_relationship(self):
        transaction = Transaction.objects.create(
            title='Test Transaction',
            description='This is a test transaction.',
            kind='income',
            amount=Decimal('100.00'),
            date=self.dateTest,
            user=self.user
        )
        self.assertEqual(transaction.user.username, 'testuser')
        self.assertEqual(transaction.user.email, 'testuser@example.com')

    def test_transaction_user_deletion(self):
        transaction = Transaction.objects.create(
            title='Test Transaction',
            description='This is a test transaction.',
            kind='income',
            amount=Decimal('100.00'),
            date=self.dateTest,
            user=self.user
        )
        self.user.delete()
        with self.assertRaises(Transaction.DoesNotExist):
            transaction.refresh_from_db()


class CategoryTestCase(TestCase):
    def test_category_creation(self):
        category = Category.objects.create(name='Test Category', description='This is a test category.')
        self.assertEqual(category.name, 'Test Category')
        self.assertEqual(category.description, 'This is a test category.')