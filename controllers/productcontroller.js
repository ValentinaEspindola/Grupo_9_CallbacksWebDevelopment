const express = require('express');
const app = express();
const path = require('path')
const fs = require('fs')
let productsFilePath = path.join(__dirname, '../data/products.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
let db = require("../database/models")






const controlador = {
listado: (req,res) => {
	db.products.findAll()
	.then(products=>{
		res.render('products/products', {products})
	})
    
},
tech: (req,res)=>{
	db.products.findAll(
		{
            include: [{association: 'categorias'}]
		}
	)
	.then(products=>{
		res.render('products/tech', {products})
	})
},
vintage: (req,res)=>{
	db.products.findAll(
		{
            include: [{association: 'categorias'}]
		}
	)
	.then(products=>{
		res.render('products/vintage', {products})
	})
},
carrito: (req,res)=>{
    const idProductToEdit = req.params.id - 1;
	const productToEdit = products[idProductToEdit]
	
	
    res.render ('products/productCart', {productToEdit});
},
detalle: (req,res)=>{
    let id = req.params.id
	db.products.findByPk(id,{
		include: [{association: 'categorias'},{association:'colores'}]
	})
	.then(productToEdit=> {
		console.log(productToEdit.colores)
		res.render('products/productDetail', {productToEdit: productToEdit})
	})
	
           
	
    
},
//Acá va el CRUD
crear: (req,res)=>{
	db.categoryProduct.findAll()
	.then(categorias=>{
		res.render('products/create', {categorias});
	})
    
},
creado: (req,res)=>{
	 
	console.log(req.body.color)
	

	db.products.create(
		
		{
			nombre: req.body.nombre,
			descripcion: req.body.descripcion,
			imagen: req.file.filename,
			precio: req.body.precio,
			category_product_id: req.body.category,
			color_product_id: req.body.color
			


		})
		.then(()=> {res.redirect("/products");})
        .catch(()=>{res.send('error')})
	

    
    
	//let newProductId = (products[products.length - 1].id) + 1;
   
	// aclaraciones para la creacion del producto 	
	//newProduct.imagen = req.file.filename // que la imagen sea la que ingreso por formulario
    // newProduct.id = newProductId // que el id tenga la logica de la variable newProductId
	//newProduct.category = newProduct.category // que la categoría sea la misma que ingreso por form

	//products.push(newProduct);
			
			
	//fs.writeFileSync(productsFilePath, JSON.stringify(products))
		  
	
	

    
},
editar: (req,res)=>{
        let promReloj = db.products.findByPk(req.params.id, {
            include: [{association: 'categorias'}, {association:'colores'}]


        })
		let promCategoria = db.categoryProduct.findAll()
		Promise.all([promReloj, promCategoria])
        .then(([resultReloj,resultCategoria])=> res.render('products/edit',{productToEdit: resultReloj, categorias: resultCategoria}))
        .catch(()=>{res.send('error')})

			.then(productToEdit => res.render("products/edit", {productToEdit}))
	},
	// let id = req.params.id
	// let productToEdit = products.filter((producto)=> producto.id == id)[0];
		
	
	// res.render('products/edit', {productToEdit})
		
    
editado: (req,res)=>{

	let imagen = req.file.filename
	if(req.file === "undefined"){
		imagen = 'imagenPredeterminada.webp'
	}
		console.log(req.file.filename)
        db.products.update({
			
			nombre: req.body.nombre,
			descripcion: req.body.descripcion,
			imagen: imagen,
			precio: req.body.precio,
			category_product_id: req.body.category,
			color_product_id: req.body.color


		},
        {
            where: {id: req.params.id}
        })
		.then( products => res.redirect('/products'))
    

		// // ESTO ES EL PRODUCTO CON MODIFICACIONES
		// const body = req.body 

		// //ESTO ES EL PRODUCTO ORIGINAL
		// let id = req.params.id
		// let productToEdit = products.filter((producto)=> producto.id == id)[0];
		
		// console.log(body); // Con modificaciones
		// console.log('-----------------');
		// console.log(productToEdit); // original

	    // for(let i = 0; i<products.length; i ++){
		// 	if(productToEdit.id == products[i].id){
		// 		products[i].id = products[i].id
		// 		products[i].precio = body.precio;
		// 		products[i].color = body.color;
		// 		products[i].nombre = body.nombre;
		// 		products[i].descripcion = body.descripcion;
		// 		products[i].category = body.category;
		// 		products[i].imagen = req.file.filename  


				
		// 	}
		// }

		
	 

	
	//   fs.writeFileSync(productsFilePath, JSON.stringify(products))
	
	//   res.redirect('/products')
	
	 
},
eliminar: (req,res)=>{

	
        let idSelected = req.params.id
        db.products.destroy({
            where: { 
                id: idSelected
            },
            force: true
        })
        .then(()=>{res.redirect('/products')})
    }
	// let idProductDelete = req.params.id
	// console.log(idProductDelete)
	// products = products.filter(product => 
	// product.id != idProductDelete
	// 	)

	// fs.writeFileSync(productsFilePath, JSON.stringify(products))
	
	// res.redirect('/products')
	

    // }
};
module.exports = controlador; 