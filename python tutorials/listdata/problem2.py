"""
[1,2,3,4]

max = 
min = 

"""

def value():
    lst = []
    user = int(input("Enter how menty number you want = "))
    for i in range(user):
        add = int(input(f"Enter number {i} = "))
        lst.append(add)

    print(lst)
    maximum = max(lst)
    print("maximum value is = ",maximum)

    minimum = min(lst)
    print("minimum value is ",minimum)

value()