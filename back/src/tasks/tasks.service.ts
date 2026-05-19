import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        author: true,
        tags: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.task.create({
      data: data,
    });
  }

  async findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateData: any) {
    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async partialUpdate(id: number, updateData: any) {
    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}