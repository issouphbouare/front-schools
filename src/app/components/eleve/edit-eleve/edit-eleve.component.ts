import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EleveService } from 'src/app/services/eleve.service';
import { ClasseService } from 'src/app/services/classe.service';
@Component({
  selector: 'app-edit-eleve',
  templateUrl: './edit-eleve.component.html',
  styleUrls: ['./edit-eleve.component.css']
})
export class EditEleveComponent implements OnInit {

  public donnee:any;
  public region: any;
  public classes: any;
  public classeCur:any
  public nbPage : number=0;
  public pages : Array<number>=[];
  public url: string='';
  public selectedClasse : any
  public isMensuel!: boolean;
  public isNoMensuel!: boolean;
  public isMensuelType: string="hidden"
  public isNoMensuelType: string="hidden"
  form : FormGroup= new FormGroup({});



  constructor(private http: HttpClient,private route:ActivatedRoute,
    private apiService: EleveService, private formBuilder:FormBuilder ,
    private router : Router, private classeService: ClasseService) { }

  ngOnInit(): void {
    this.form=this.formBuilder.group({
      prenom: ['', [Validators.required, Validators.pattern("([a-zA-Z]).{1,}")]],
      nom: ['', [Validators.required, Validators.pattern("([A-Z]){1,}")]],
      genre : ['',[Validators.required]],
      dateNaissance: ['', [Validators.required, this.validateDateNaissance]],
      lieuNaissance: ['', [Validators.required, Validators.pattern("([a-zA-Z]).{1,}")]],
      nomTuteur : ['',[Validators.required]],
      telTuteur: ['', [Validators.required, Validators.pattern('^[5-9][0-9]{7}$'),]],
      modePaiement : ['',[Validators.required]],
      inscription : ['',[Validators.pattern('^[0-9]*$'),]],
      relicat : ['',[ Validators.pattern('^[0-9]*$'),]],
      mensualite : ['',[Validators.pattern('^[0-9]*$'),]],
      scolarite : ['',[ Validators.pattern('^[0-9]*$'),]],
      classe : [''],

    });
    this.url=this.route.snapshot.params['id']
    this.getEleve();
    this.getClasses();

  }
  getEleve(){
    this.apiService.getById(this.url)
    .subscribe((data: any)=>{

    this.donnee=data;
    this.selectedType=this.donnee.modePaiement
    if(this.selectedType==="Mensuel"){
      this.isMensuel=true; this.isMensuelType='tel'
    }else {
      this.isNoMensuel=true; this.isNoMensuelType='tel'
    }  this.selectedClasse=this.donnee.classe.id;
       this.getClasseCur()
  }, err=>{
    console.log(err);
  })

  }

  getClasseCur(){
    this.classeService.getById(this.selectedClasse)
    .subscribe((data: any)=>{
    this.classeCur=data;

  }, err=>{
    console.log(err);
  })
 }







  onSubmit(){
    console.log(this.form.value);
    console.log(this.form.value.classe.content);
    if(this.form.value.modePaiement==="Mensuel") this.form.value.scolarite=0
    if(this.form.value.modePaiement!=="Mensuel") this.form.value.mensualite=0
    this.form.value.classe=this.classeCur
    this.apiService.Update(this.donnee.id, this.form.value).
    subscribe( (data: any) => {
      console.log(data);
      alert(" Eleve  "+data.nom+"  modifie avec succes ");
      this.router.navigate(['eleves']);
      }, err=>{
        console.log(err);
        alert("Il existe deja un eleve avec le meme matricule !");
      });

  }

  getClasses(){
    this.classeService.getAll()
    .subscribe((data: any)=>{
    this.classes=data;

  }, err=>{
    console.log(err);
  })

  }

  selectedGenre: string = '';
  optionsG: { value: string, label: string }[] = [
    { value: '', label: '' },
    { value: 'Fille', label: 'Fille' },
    { value: 'Garçon', label: 'Garçon' }

  ];
  onSelectionGenre() {

  }

  selectedType: string = '';
  optionsTypes: { value: string, label: string }[] = [

    { value: 'Mensuel', label: 'Mensuel' },
    { value: 'Non_Mensuel', label: 'Non_Mensuel' },
  ];
  onSelectionType() {
       if(this.selectedType==='Mensuel'){
        this.isMensuelType="tel"; this.isMensuel=true;
        this.isNoMensuelType="hidden"; this.isNoMensuel=false;
       }
       if(this.selectedType!=='Mensuel'){
        this.isMensuelType="hidden"; this.isMensuel=false;
        this.isNoMensuelType="tel"; this.isNoMensuel=true;
       }
  }

  //Validation de la date de naissaince
  validateDateNaissance(control: any): { [key: string]: any } | null {
    const selectedDate: Date = new Date(control.value);
    const currentDate: Date = new Date();
    const ageLimite: number = 100; // Vous pouvez ajuster la limite d'âge ici

    if (!selectedDate || isNaN(selectedDate.getTime())) {
      return { 'invalidDate': true };
    }

    // Vérifie si la date est supérieure à la date actuelle
    if (selectedDate > currentDate) {
      return { 'dateFutur': true };
    }

    // Vérifie si l'âge calculé est supérieur à l'âge limite
    const diff = currentDate.getFullYear() - selectedDate.getFullYear();
    if (diff > ageLimite) {
      return { 'ageLimiteDepasse': true };
    }

    return null;
  }
}



