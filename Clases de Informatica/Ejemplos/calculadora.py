#Ejemplo de una calculadora Usando Python 

"""
(1) Sumar
(2) Restar
(3) Multiplicacion
(4) Division 

"""
#Declatracion de la funcion 
def calculadora(num1, num2, op):
    
    #Cuerpo de la funcion 
    #En el cuerpo de la funcion se encuentra todo el bloque de codigo 
    
    if op == 1:
        #return (num1 + num2)
        print(f'El resultado de la suma de {num1} y {num2} es: {num1 + num2}')
    
    elif op == 2:
        # return (num1 - num2)
        print(f'El resultado de la resta de {num1} y {num2} es: {num1 - num2}')
    elif op == 3:
        # return (num1 * num2)
        print(f'El resultado de la multiplicacion de {num1} y {num2} es: {num1 * num2}')
    elif op == 4:
        # return (num1 / num2)
        print(f'El resultado de la division de {num1} y {num2} es: {num1 / num2}')
    else:
        print('Te equivocaste de opcion')

#Llamada de la funcion 
# resultado = calculadora(33, 23, 2)
# print(resultado)


calculadora(9, 7, 8)

#En programacion el if es un condicional quiere decir si en ingles 