def odd_eve():
    num = int(input("Enter number to cheak = "))
    if num % 2 == 0:
        print("Even")
    return num

user = odd_eve()
print(user)