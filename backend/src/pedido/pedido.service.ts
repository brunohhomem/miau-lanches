import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class PedidoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const {
      lanches,
      bebidas,
      adicionais,
      cliente,
      observacoes,
      preco,
      descricao,
    } = createPedidoDto;

    const newCliente = await this.prismaService.cliente.create({
      data: cliente,
    });

    const clienteId = newCliente.id;

    return this.prismaService.pedido.create({
      data: {
        descricao,
        preco,
        observacoes,
        cliente: { connect: { id: clienteId } },
        lanches: {
          connect: lanches?.map((id) => ({ id })) || [],
        },
        bebidas: {
          connect: bebidas?.map((id) => ({ id })) || [],
        },
        adicionais: {
          connect: adicionais?.map((id) => ({ id })) || [],
        },
      },
    });
  }

  async findAll() {
    return this.prismaService.pedido.findMany({
      include: {
        lanches: true,
        bebidas: true,
        adicionais: true,
        cliente: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prismaService.pedido.findUnique({
      where: { id },
      include: {
        lanches: true,
        bebidas: true,
        adicionais: true,
        cliente: true,
      },
    });
  }

  // async update(id: number, updatePedidoDto: UpdatePedidoDto) {
  //   const { lanches, bebidas, adicionais, ...rest } = updatePedidoDto;

  //   return this.prismaService.pedido.update({
  //     where: { id },
  //     data: {
  //       ...rest,
  //       lanches: {
  //         set: lanches?.map((id) => ({ id })) || [],
  //       },
  //       bebidas: {
  //         set: bebidas?.map((id) => ({ id })) || [],
  //       },
  //       adicionais: {
  //         set: adicionais?.map((id) => ({ id })) || [],
  //       },
  //     },
  //   });
  // }

  async remove(id: number) {
    return this.prismaService.pedido.delete({
      where: { id },
    });
  }
}
