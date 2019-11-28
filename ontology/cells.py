# Generation of cells for ontology (Turtle format)

f = open("cells.txt", "a")

for x in range(10):
    for y in range(10):

        north_x = x - 1
        north_y = y

        south_x = x + 1
        south_y = y

        west_x = x
        west_y = y - 1

        est_x = x
        est_y = y + 1

        f.write(":cell" + str(x) + str(y) + " rdf:type owl:NamedIndividual , \n")
        f.write("\t \t :Cell ;\n")
        f.write("\t :x \"" + str(x) + "\"^^xsd:int ;\n")
        f.write("\t :y \"" + str(y) + "\"^^xsd:int ;\n")
        # North
        if north_x != -1:
            f.write("\t :hasNorth :cell" + str(north_x) + str(north_y) + ";\n")
        else:
            f.write("\t :hasNorth :wall ;\n")
        # South
        if south_x != 10:
            f.write("\t :hasSouth :cell" + str(south_x) + str(south_y) + ";\n")
        else:
            f.write("\t :hasSouth :wall ;\n")
        # West
        if west_y != -1:
            f.write("\t :hasWest :cell" + str(west_x) + str(west_y) + ";\n")
        else:
            f.write("\t :hasWest :wall ;\n")
        # Est
        if est_y != 10:
            f.write("\t :hasEast :cell" + str(est_x) + str(est_y) + ".\n\n")
        else:
            f.write("\t :hasEast :wall .\n\n")

f.close()
