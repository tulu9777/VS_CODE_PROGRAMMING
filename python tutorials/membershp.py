"""
in ->
not in -> False
"""

main_str = input("Enter main string = ")
sub_str = input("Enter sub string = ")

if sub_str in main_str :
    print(f"{sub_str} is founf in {main_str}")

else:
    print(f"{sub_str}not found in {main_str}")