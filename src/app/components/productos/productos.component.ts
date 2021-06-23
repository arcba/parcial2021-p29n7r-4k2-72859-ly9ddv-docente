import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  Titulo = 'Productos';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Producto[] = null;
  RegistrosTotal: number;
  
  Pagina = 1; // inicia pagina 1
  submitted: boolean = false;

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: '' },
    { Id: true, Nombre: 'SI' },
    { Id: false, Nombre: 'NO' }
  ];

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private productoService: ProductoService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    // this.FormBusqueda = this.formBuilder.group({
    //   Nombre: [null],
    //   Activo: [null]
    // });
    this.FormRegistro = this.formBuilder.group({
      ProductoID: [0],
      ProductoNombre: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      ProductoFechaAlta: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],
      ProductoStock: [null, [Validators.required, Validators.pattern('^\\d{1,10}$')]]
    
      
    
    });

    // this.GetFamiliasArticulos();
  }

  // GetFamiliasArticulos() {
  //   this.articulosFamiliasService.get().subscribe((res: ArticuloFamilia[]) => {
  //     this.Familias = res;
  //   });
  // }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ Activo: true, ProductoID: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }

  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    //this.modalDialogService.BloquearPantalla();
    this.productoService
      .get()
      //this.articulosService.get("", null, this.Pagina)
      .subscribe((res: any) => {
        this.Items = res;
        // this.Items = res.Items;
        //this.RegistrosTotal = res.RegistrosTotal;
        //this.modalDialogService.DesbloquearPantalla();
      });
  }

  // Obtengo un registro especifico según el Id
  // BuscarPorId(Dto, AccionABMC) {
  //   window.scroll(0, 0); // ir al incio del scroll
  //   this.AccionABMC = AccionABMC;
  // }
  // Obtengo un registro especifico según el Id
  // BuscarPorId(Dto, AccionABMC) {
  //   window.scroll(0, 0); // ir al incio del scroll

  //   this.articulosService.getById(Dto.IdArticulo).subscribe((res: any) => {
  //     const itemCopy = { ...res }; // hacemos copia para no modificar el array original del mock

  //     //formatear fecha de  ISO 8061 a string dd/MM/yyyy
  //     var arrFecha = itemCopy.FechaAlta.substr(0, 10).split('-');
  //     itemCopy.FechaAlta = arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0];

  //     this.FormRegistro.patchValue(itemCopy);
  //     this.AccionABMC = AccionABMC;
  //   });
  // }

  // GetArticuloFamiliaNombre(Id) {
  //   var ArticuloFamilia = this.Familias.filter(
  //     x => x.IdArticuloFamilia === Id
  //   )[0];
  //   if (ArticuloFamilia) return ArticuloFamilia.Nombre;
  //   else return '';
  // }

  // Consultar(Dto) {
  //   this.BuscarPorId(Dto, 'C');
  // }

  // comienza la modificacion, luego la confirma con el metodo Grabar
  // Modificar(Dto) {
  //   this.submitted = false;
  //   this.FormRegistro.markAsUntouched();
  //   if (!Dto.Activo) {
  //     this.modalDialogService.Alert(
  //       'No puede modificarse un registro Inactivo.'
  //     );
  //     return;
  //   }
  //   this.BuscarPorId(Dto, 'M');
  // }

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.ProductoFechaAlta.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.ProductoFechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      //this.modalDialogService.BloquearPantalla();
      this.productoService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
        //this.modalDialogService.DesbloquearPantalla();
      });
    } else {
      // modificar put
      //this.modalDialogService.BloquearPantalla();
      // this.articulosService
      //   .put(itemCopy.IdArticulo, itemCopy)
      //   .subscribe((res: any) => {
      //     this.Volver();
      //     this.modalDialogService.Alert('Registro modificado correctamente.');
      //     this.Buscar();
      //     //this.modalDialogService.DesbloquearPantalla();
      //   });
    }
  }

  // representa la baja logica
  // ActivarDesactivar(Dto) {
    // var resp = confirm(
    //   'Esta seguro de ' +
    //     (Dto.Activo ? 'desactivar' : 'activar') +
    //     ' este registro?'
    // );
    // if (resp === true) {
    //   this.articulosService
    //     .delete(Dto.IdArticulo)
    //     .subscribe((res: any) => this.Buscar());
    // }

  //   this.modalDialogService.Confirm(
  //     'Esta seguro de ' +
  //       (Dto.Activo ? 'desactivar' : 'activar') +
  //       ' este registro?',
  //     undefined,
  //     'SI',
  //     'NO',
  //     () =>
  //       this.articulosService
  //         .delete(Dto.IdArticulo)
  //         .subscribe((res: any) => this.Buscar())
  //   );
  // }

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = 'L';
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }
}
