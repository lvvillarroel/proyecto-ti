CREATE TABLE IF NOT EXISTS products (
    sku INTEGER PRIMARY KEY,
    name text NOT NULL,
    description text,
    stock INTEGER
);

-- crear Bodega, pedido (orden de compra)
SELECT * FROM products;

INSERT INTO products (sku, name, description, stock)
    VALUES (1004, 'Fideos Corbata 400 grs', 'Bolsa 400 grs', 0),
    VALUES (1006, 'Fideos Espirales 400 grs', 'Bolsa 400 grs', 0),
    VALUES (1008, 'Fideos Spaghetti 5 400 grs', 'Bolsa 400 grs', 0),
    VALUES (1009, 'Harina 1 Kg', 'Harina sin polvos de hornear', 0),
    VALUES (1010, 'Harina 5 Kg', 'Harina sin polvos de hornear saco', 0),
    VALUES (1014, 'Leche condensada', 'Lata', 0),
    VALUES (1016, 'Poroto tórtola', 'Bolsa 1 kg', 0),
    VALUES (1017, 'Poroto blanco', 'Bolsa 1 kg', 0),
    VALUES (1020, 'Lentejas', 'Bolsa 1 kg', 0),
    VALUES (1023, 'Azúcar 1 Kg', 'Bolsa 1 Kg', 0),
    VALUES (1025, 'Crema para batir caja', 'Pack 6x Tetrapack 200 cc', 0),
    VALUES (1027, 'Durazno en cubos', 'Pack 2x Tarro 590 grs', 0),
    VALUES (1035, 'Té caja', 'Caja 20 unidades', 0);
