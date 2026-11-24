"""
print Even number from 1 to 10
Question : Write a program to print all even  number from 1 to 10 

Expeted output : 2 4 6 8 10
Hint : Check if number is even isung number % 2 == 0.

"""

#Answer

for i in range(1,11):
    if i % 2 == 0:
        print(i, end=" ")
