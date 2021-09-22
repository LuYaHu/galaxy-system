# Copyright (C) 2020 Einsam
#
# Makefile to be used in the SolarSystem project
# Can be easily modified for other projects.
#

CC = g++

GLFLAGS = -lGL -lglfw -ldl -ldl

OBJ1 = main.cpp

OBJ2 = glad.c

OBJ1_EXEC = solarSystem

all:
	$(CC) $(OBJ1) $(OBJ2) -o $(OBJ1_EXEC) $(GLFLAGS)
	./solarSystem

build:
	$(CC) $(OBJ1) $(OBJ2) -o $(OBJ1_EXEC) $(GLFLAGS)

clean:
	rm -rf solarSystem

