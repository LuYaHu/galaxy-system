# Copyright (C) 2020 Einsam
#
# Makefile to be used in the SolarSystem project
# Can be easily modified for other projects.
#

CC = g++

GLFLAGS = -I include -lGL -lglfw -ldl

OBJ1 = src/main.cpp

OBJ2 = include/glad.c

OBJ1_EXEC = build/release/solarSystem

all:
	$(CC) $(OBJ1) $(OBJ2) -o $(OBJ1_EXEC) $(GLFLAGS)
	build/release/solarSystem

build:
	$(CC) $(OBJ1) $(OBJ2) -o $(OBJ1_EXEC) $(GLFLAGS)

clean:
	rm -rf build/release/solarSystem

