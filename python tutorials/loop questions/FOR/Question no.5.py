"""
REver a Word
Question : Write a program to print the word 'python' in reverse using a for loop .
Expeted output: nohtyp
Hint: Use reverse indexing or loop through the word in reverse order.
"""

#Answer

word = 'python'
for i in range(len(word)-1,-1,-1):
    print(word[i], end=" ")
    
