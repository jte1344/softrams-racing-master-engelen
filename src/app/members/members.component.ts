import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})

export class MembersComponent implements OnInit {
  members = [];
  teams = [];
  memPos: number;
  closeResult: string;

  constructor(
    public appService: AppService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.appService.getMembers().subscribe(members => (this.members = members));

    //gets teams from DB
    this.appService.getTeams().subscribe(teams => (this.teams = teams));


    //redirects back to login if no user present
    if (this.appService.username === null) {
      console.log("User NOT signed in");
      this.router.navigateByUrl('/');
    }
  }



  goToAddMemberForm(firstName: string, lastName: string, jobTitle: string, team: string, status: string) {

    //logic for new member ID (get prev and adds 1)
    var id;
    if (this.members.length === 0) {
      id = 0;
    } else {
      id = this.members[this.members.length - 1].id + 1;
    }

    //new member object
    var newMember = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle,
      team: team,
      status: status,
    }

    //adds new member to client side
    this.members.push(newMember)

    //sends new member to server side
    this.appService.addMember(newMember);
  }

  //gets member by id to allow modal form manipulation
  getEditMemberByID(id: number) {
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id) {
        this.memPos = i;
      }
    }
  }


  editMemberByID(id: string, firstName: string, lastName: string, jobTitle: string, team: string, status: string) {

    //finds member by id
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id == id) {
        //makes client changes
        this.members[i].firstName = firstName;
        this.members[i].lastName = lastName;
        this.members[i].jobTitle = jobTitle;
        this.members[i].team = team;
        this.members[i].status = status;
        //sends to server to change in DB
        this.appService.editMember(this.members[i]);
        break;
      }

    }
  }

  deleteMemberById(id: number) {
    console.log(id);

    //finds which member's position to delete
    var removeAt = 0;
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id) {
        removeAt = i;
        break;
      }
    }
    //send to delete info server first
    this.appService.deleteMember(this.members[removeAt]);
    //removes member from client side
    this.members.splice(removeAt, 1);
  }



  //opens modal
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //determines how modal was closed
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
