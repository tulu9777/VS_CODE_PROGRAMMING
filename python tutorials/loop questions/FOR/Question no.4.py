"""
Calculate sum of number from 1 to 10
Question : Write a program to calculater the sum of number from 1 to 10

Expected output : sum = 55
Hint : Initialize a variables for the sum and add each number in the loop . 
"""
#Answer

total = 0
for i in range(1,11):
    total += i
print(f'sum is {total} ')