import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:8000/api';
  username: string;

  constructor(private http: HttpClient) { }

  // Returns all members
  getMembers() {
    return this.http
      .get(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }

  setUsername(name: string): void {
    this.username = name;
  }
//sends addMember data to server
  addMember(data) {
    console.log("Sending new member: ");
    console.log(data);

    return this.http
      .post<any>(`${this.api}/addMember`, data).subscribe(response => {
        console.log(response);
      })
  }
//sends editMember data to server
  editMember(data) {
    return this.http
      .post(`${this.api}/editMember`, data).subscribe(response => {
        console.log(response);
      })
  }

//sends deleteMember data to server
  deleteMember(data) {
    return this.http
      .post(`${this.api}/deleteMember`, data).subscribe(response => {
        console.log(response);
      })
  }

//gets teams from server
  getTeams() {
    return this.http
      .get(`${this.api}/teams`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
