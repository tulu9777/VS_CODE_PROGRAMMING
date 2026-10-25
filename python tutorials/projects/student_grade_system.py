"""
add
update
delete
viwe
exit
"""
#create a dectionary
student = {
    'paras':100,
    'gopal':200
}
#accessing a element
print(student['gopal'])

#update
student['gopal'] = 300
print(student)

#delete
del student['paras']
print(student)