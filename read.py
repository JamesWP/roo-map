import struct

cell_map = {
    0: ' ',
    5: 'X',
    6: 'Y',
    7: 'Z',
    8: 'W',
    9: 'O',
    10: 'Q'
}

item_map = {
    1: '$'
}

def cell_char(x):
    floor = cell_map[x[0]] if x[0] in cell_map else '?' 
    item = item_map.get(x[3], None if x[3] == 0 else str(x[3]))
    return item if item else floor

def print_level(fileName):
    with open(fileName, 'rb') as file:
        print("Hello world")
        xsize, ysize = struct.unpack('BB', file.read(2))
        array = []
        for i in range(xsize * ysize):
            cell = struct.unpack('BBBB', file.read(4))
            array.append(cell)


        print(xsize)
        print(ysize)

        for y in range(ysize):
            rowStart = ysize * y
            rowEnd = rowStart+xsize
            print(*( cell_char(x) for x in array[rowStart: rowEnd]))

if __name__ == '__main__':
    print_level(sys.argv[1])

#print_level('Start.jjm')
#print_level('BonusWay.jjm')
#print_level('StairsStart.jjm')
