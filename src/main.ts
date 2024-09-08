import "./style.css";

type TipoIva =
  | "general"
  | "reducido"
  | "superreducidoA"
  | "superreducidoB"
  | "superreducidoC"
  | "sinIva";

interface Producto {
  nombre: string;
  precio: number;
  tipoIva: TipoIva;
}

interface LineaTicket {
  producto: Producto;
  cantidad: number;
}

interface ResultadoLineaTicket {
  nombre: string;
  cantidad: number;
  precionSinIva: number;
  tipoIva: TipoIva;
  precioConIva: number;
}

interface ResultadoTotalTicket {
  totalSinIva: number;
  totalConIva: number;
  totalIva: number;
}

interface TotalPorTipoIva {
  tipoIva: TipoIva;
  cuantia: number;
}

interface TicketFinal {
  lineas: ResultadoLineaTicket[];
  total: ResultadoTotalTicket;
  desgloseIva: TotalPorTipoIva[];
}

const productos: LineaTicket[] = [
  {
    producto: {
      nombre: "Legumbres",
      precio: 2,
      tipoIva: "general",
    },
    cantidad: 2,
  },
  {
    producto: {
      nombre: "Perfume",
      precio: 20,
      tipoIva: "general",
    },
    cantidad: 3,
  },
  {
    producto: {
      nombre: "Leche",
      precio: 1,
      tipoIva: "superreducidoC",
    },
    cantidad: 6,
  },
  {
    producto: {
      nombre: "Lasaña",
      precio: 5,
      tipoIva: "superreducidoA",
    },
    cantidad: 1,
  },
];

const aplicaIvaGeneral = (precioSinIva: number): number => {
  return precioSinIva + precioSinIva * 0.21;
};

const aplicaIvaReducido = (precioSinIva: number): number => {
  return precioSinIva + precioSinIva * 0.1;
};

const aplicaIvaSuperReducidoA = (precioSinIva: number): number => {
  return precioSinIva + precioSinIva * 0.05;
};

const aplicaIvaSuperReducidoB = (precioSinIva: number): number => {
  return precioSinIva + precioSinIva * 0.04;
};

const getPrecioConIva = (tipoIva: TipoIva, precio: number): number => {
  let precioConIva = 0;
  switch (tipoIva) {
    case "general":
      precioConIva = aplicaIvaGeneral(precio);
      break;
    case "reducido":
      precioConIva = aplicaIvaReducido(precio);
      break;
    case "superreducidoA":
      precioConIva = aplicaIvaSuperReducidoA(precio);
      break;
    case "superreducidoB":
      precioConIva = aplicaIvaSuperReducidoB(precio);
      break;
    case "superreducidoC" || "sinIva":
      precioConIva = precio;
      break;
  }
  return precioConIva;
};

const fixedPrecio = (precio: number): number => {
  return +precio.toFixed(2);
};

const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
  const lineas: ResultadoLineaTicket[] = lineasTicket.map((linea) => {
    const {
      producto: { nombre, tipoIva, precio },
      cantidad,
    } = linea;
    let precioConIva = getPrecioConIva(tipoIva, precio);

    return {
      nombre,
      cantidad,
      precionSinIva: precio,
      tipoIva: tipoIva,
      precioConIva,
    };
  });

  const total: ResultadoTotalTicket = lineasTicket.reduce(
    (acc, linea) => {
      const {
        producto: { tipoIva, precio },
        cantidad,
      } = linea;
      let precioConIva = getPrecioConIva(tipoIva, precio);

      return {
        totalSinIva: fixedPrecio(acc.totalSinIva + precio * cantidad),
        totalConIva: fixedPrecio(acc.totalConIva + precioConIva * cantidad),
        totalIva: fixedPrecio(
          acc.totalIva + (precioConIva - precio) * cantidad
        ),
      };
    },
    { totalSinIva: 0, totalConIva: 0, totalIva: 0 }
  );

  const desgloseIva: TotalPorTipoIva[] = lineasTicket.reduce((acc, linea) => {
    const {
      producto: { tipoIva, precio },
    } = linea;
    let precioConIva = getPrecioConIva(tipoIva, precio);

    const index = acc.findIndex((item) => item.tipoIva === tipoIva);

    if (index === -1) {
      acc.push({
        tipoIva,
        cuantia: fixedPrecio(precioConIva - precio),
      });
    } else {
      acc[index].cuantia += fixedPrecio(precioConIva - precio);
    }
    return acc;
  }, [] as TotalPorTipoIva[]);

  return {
    lineas,
    total,
    desgloseIva,
  };
};

calculaTicket(productos);
