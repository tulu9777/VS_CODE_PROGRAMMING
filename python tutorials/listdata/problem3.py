"""
[1,2,3,4,5]
[1,2,6,7,8]

[1,2]
"""

def common():
    s1 = [1,2,3,4,5]
    s2 = [1,2,5,6,7,8]

    lst_1 = set(s1)
    lst_2 = set(s2)

    unique_ele = lst_1.intersection(lst_2)
    print(unique_ele)

common()