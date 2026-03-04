import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from '../modal/modal';
import { IStudent } from '../InterFace/student';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  // constructor(private readonly http:HttpClient)
  private cdr = inject(ChangeDetectorRef);

  studentObj: any = {
    studentId: 0,
    studentName: '',
    mobileNo: '',
    email: '',
    // divisionName : '',
    divisionId: 0,
    // districtName : '',
    districtId: 0,
    pincode: '',
    address: '',
  };

  divisions: any[] = [];
  districts: any[] = [];

  loadDivisions() {
    this.http.get<any[]>('https://localhost:7075/api/Dropdown/division').subscribe({
      next: (res) => {
        this.divisions = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onDivisionChange() {
    // this.studentObj.districtId = 0;
    // console.log(e.target.value)
    const divisionId = this.studentObj.divisionId;

    if (!divisionId) {
      this.districts = [];
      this.studentObj.districtId = 0;
      return;
    }

    this.http
      .get<any[]>(`https://localhost:7075/api/Dropdown/districts/${divisionId}`)
      .subscribe((res) => (this.districts = res));
    // this.districts = this.districtMap[this.studentObj.division] || [];
    // this.studentObj.district = '';
  }

  http = inject(HttpClient);

  studentList: IStudent[] = [];

  ngOnInit(): void {
    this.getAllStudent();
    // this.saveStudent();
    this.loadDivisions();
  }

  getAllStudent() {
    this.http.get('https://localhost:7075/api/StudentMaster').subscribe({
      next: (result: any) => {
        // debugger;
        this.studentList = result;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        // debugger;
      },
    });
  }

  //Edit Section


  editStudent(student: any) {  

 

  this.studentObj = {
    studentId: student.studentId,
    studentName: student.studentName,
    mobileNo: student.mobileNo,
    email: student.email,
    address: student.address,
    divisionId: student.divisionID,
    districtId: student.districtID ?? student.districtId, 
  };

  const divisionId = this.studentObj.divisionId;
  if (!divisionId) return;

  this.http
    .get<any[]>(`https://localhost:7075/api/Dropdown/districts/${divisionId}`)
    .subscribe((res) => {
      this.districts = res;
      setTimeout(() => {
        this.studentObj.districtId = student.districtID ?? student.districtId; 
        this.cdr.detectChanges();
      });
    });
}



  saveStudent() {
    this.studentObj.divisionId = parseInt(this.studentObj.divisionId);
    this.studentObj.districtId = parseInt(this.studentObj.districtId);

    if (!this.studentObj.divisionId || !this.studentObj.districtId) {
      // alert('Division & District required');
      return;
    }

    // console.log(this.studentObj);
    if (this.studentObj.studentId === 0) {
      this.http.post('https://localhost:7075/api/StudentMaster', this.studentObj).subscribe({
        next: () => {
          // alert('Student Saved Successfully');
          this.getAllStudent();
          this.resetForm();
          console.log(this.studentObj);
        },
        error: () => {
          debugger;
          // alert('Error while saving');
        },
      });
    } else {
      // Update existing student

      this.http
        .put(
          `https://localhost:7075/api/StudentMaster/${this.studentObj.studentId}`,
          this.studentObj,
        )
        .subscribe({
          next: () => {
            this.getAllStudent(); // refresh table
            this.resetForm();
            // alert('Student updated successfully');
          },
          error: () => {
            alert('Error while updating student');
          },
        });
    }
  }

  resetForm() {
    this.studentObj = {
      studentId: 0,
      studentName: '',
      mobileNo: '',
      email: '',
      city: '',
      pincode: '',
      address: '',
    };
  }

  //Delete Section
  selectedStudentId!: number;

  openDeleteModal(id: number) {
    this.selectedStudentId = id;
  }

  deleteStudent(id: number) {
    this.http.delete(`https://localhost:7075/api/StudentMaster/${id}`).subscribe({
      next: () => {
        // this.loadStudents();

        this.studentList = this.studentList.filter((s) => s.studentId !== this.selectedStudentId);
        this.getAllStudent();

        // alert('Student deleted successfully');
        // console.log('DELETE API CALLED');
      },
      error: () => {
        alert('Delete failed');
      },
    });
  }
}
