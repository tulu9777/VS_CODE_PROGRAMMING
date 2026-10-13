def lines():
    line = int(input("Enter a number of line = "))
    for i in range(1, line+1):
        for j in range(i):
            print("*" ,end=" ")
        print()

    return f"the{line} number of trangle has been created"

triangle = lines()
print(triangle)


    