import { Component, Inject, Optional, ViewChild, OnDestroy, OnInit, ViewEncapsulation, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

// import Swal from 'sweetalert2';
import * as $ from 'jquery';

export interface UsersData {
  name: string;
  id: number;
  detail: string;
}

export interface CategoriesNew {
  position: number;
  generalCategory: string;
  subCategory: string;
  detailCategory: string;
  isChecked: boolean;
  generalCode: string;
  subCode: string;
  detailCode: string;
}

const ELEMENT_DATA_SELECTEDLIST: CategoriesNew[] = [];

@Component({
  selector: 'items-ifs-editcat',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})

export class DialogBoxComponent implements OnInit {

  @ViewChildren(MatTable) table !: QueryList<MatTable<any>>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  bulkData: any = [];
  action: string;
  local_data: any;

  selectedPositions = [];
  isWait = true;
  displayedCategoriesColumnsNew: string[] = ['position', 'generalCategory', 'subCategory', 'detailCategory', 'isChecked'];
  displayedCategoriesColumns: string[] = ['generalCategory', 'subCategory', 'detailCategory', 'action'];

  dataSource = new MatTableDataSource(ELEMENT_DATA_SELECTEDLIST);

  selectedItemsList = [];
  checkedIDs = [];
  checkboxesDataList: any = [];
  updatedDataList: any = [];
  checked: boolean = true;

  //selected data
  selectedData: any;
  updatedData: any;

  //Field Values
  public generalCategoryFieldValue = '';
  public subCategoryFieldValue = '';
  public detailCategoryFieldValue = '';
  temp: any;
  filterSelectObj = [];
  filterValues: { position: '', generalCategory: '', subCategory: '', detailCategory: '', isChecked: '', generalCode: '', subCode: '', detailCode: '', topFilter: false };
  ExceededSelection: boolean = false;

  maxSelection: any;
  matselectionNo = 40;

  generalCategoryFilter = new FormControl();
  subCategoryFilter = new FormControl();
  detailCategoryFilter = new FormControl();

  selectAll: boolean = false;
  selected_Position: any;
  all_selected: number = 0;
  start_Initial: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    private http: HttpClient,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData) {

    // this.matselectionNo = Number(localStorage.getItem("categoryLimit"));
    this.getSettingData();
    this.getAllCategories();

    this.selectedData = this.data[0].detail;
    this.updatedData = this.data[1];

    this.local_data = { ...data[0] };

    this.action = this.local_data.action;
    this.selectedPositions = this.local_data.detail;

    for (var product of this.selectedPositions) {
      this.checkboxesDataList = this.checkboxesDataList.filter((value, key) => {
        return value.position != product.position;
      });
    }

    this.filterSelectObj = [
      {
        name: 'GENERALCATEGORY',
        columnProp: 'generalCategory',
        options: []
      }, {
        name: 'SUBCATEGORY',
        columnProp: 'subCategory',
        options: []
      }, {
        name: 'DETAILCATEGORY',
        columnProp: 'detailCategory',
        options: []
      }
    ]
  }

  loadConfigFile() {
    this.http.get(environment.nodeurl + '/api/file/loadconfig').subscribe(data => {
      if (data) {
        this.maxSelection = data;
      }
    });
  }

  ngOnInit(): void {
    this.fetchSelectedItems();
    this.fetchCheckedIDs();
  }

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
  }

  async getAllCategories() {
    this.http.get(environment.nodeurl + '/api/categories').subscribe(async data => {
      this.bulkData = data;

      await this.addPendingTasks(data);
      this.selectedRowData();
      // this.loadConfigFile();
    });
  }

  getSettingData(){
    this.http.get(environment.nodeurl + '/api/template/srmsettings').subscribe(data => {
      var settings = data;
      this.matselectionNo =Number(settings['categoryLimit']);
    })
  }

  filterChange(filter, event) {
    this.dataSource = this.temp;

    if (filter == "generalCategory") {
      $('#selectAll').prop('checked', false);
      this.all_selected = 0;

      this.filterValues = {
        position: '',
        generalCategory: <any>this.generalCategoryFieldValue.trim().toLowerCase(),
        subCategory: <any>this.subCategoryFieldValue.trim().toLowerCase(),
        detailCategory: <any>this.detailCategoryFieldValue.trim().toLowerCase(),
        isChecked: '',
        generalCode: '',
        subCode: '',
        detailCode: '',
        topFilter: false
      };

      this.dataSource.filter = JSON.stringify(this.filterValues);
      this.temp = this.dataSource;
    }
    else if (filter == "subCategory") {
      $('#selectAll').prop('checked', false);
      this.all_selected = 0;

      this.filterValues = {
        position: '',
        generalCategory: <any>this.generalCategoryFieldValue.trim().toLowerCase(),
        subCategory: <any>this.subCategoryFieldValue.trim().toLowerCase(),
        detailCategory: <any>this.detailCategoryFieldValue.trim().toLowerCase(),
        isChecked: '',
        generalCode: '',
        subCode: '',
        detailCode: '',
        topFilter: false
      };

      this.dataSource.filter = JSON.stringify(this.filterValues);
      this.temp = this.dataSource;
    }
    else {
      $('#selectAll').prop('checked', false);
      this.all_selected = 0;

      this.filterValues = {
        position: '',
        generalCategory: <any>this.generalCategoryFieldValue.trim().toLowerCase(),
        subCategory: <any>this.subCategoryFieldValue.trim().toLowerCase(),
        detailCategory: <any>this.detailCategoryFieldValue.trim().toLowerCase(),
        isChecked: '',
        generalCode: '',
        subCode: '',
        detailCode: '',
        topFilter: false
      };

      this.dataSource.filter = JSON.stringify(this.filterValues);
      this.temp = this.dataSource;
    }
  }

  createFilter() {
    const myFilterPredicate = function (data: CategoriesNew, filter: string): boolean {
      let searchString = JSON.parse(filter);

      let generalCategoryFound = !searchString["generalCategory"] || data["generalCategory"].toLowerCase().includes(searchString["generalCategory"]);
      let subCategoryFound = !searchString["subCategory"] || data["subCategory"].toLowerCase().includes(searchString["subCategory"]);
      let detailCategoryFound = !searchString["detailCategory"] || data["detailCategory"].toLowerCase().includes(searchString["detailCategory"]);

      if (searchString.topFilter == true) {
        return generalCategoryFound || subCategoryFound || detailCategoryFound
      } else {
        return generalCategoryFound && subCategoryFound && detailCategoryFound
      }
    }
    return myFilterPredicate;
  }

  selectedRowData() {
    for (var product of this.updatedData) {
      this.checkboxesDataList.filter(x => {
        if (product.position == x.position && x.isChecked == false) {
          x.isChecked = true;
        }
      })
    }

    this.local_data = this.updatedData;
  }

  async addPendingTasks(row_obj) {

    var count: number = 0;
    row_obj.sort(function (a, b) {
      return (a.SUPPLIER_ID - b.SUPPLIER_ID);
    });

    if (count == 0) {
      for (var product of row_obj) {
        var d = Math.random();

        this.checkboxesDataList.push({
          position: product.position,
          generalCategory: product.generalcategoryname,
          subCategory: product.subcategoryname,
          detailCategory: product.detailcategoryname,
          generalCode: product.generalcategorycode,
          subCode: product.subcategorycode,
          detailCode: product.detailcategorycode,
          isChecked: false
        });

        count = count + 1;
      }
    }

    if (count == row_obj.length) {
      this.dataSource = new MatTableDataSource<CategoriesNew>(this.checkboxesDataList);
      this.temp = this.dataSource;
      this.dataSource.paginator = this.paginator;

      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(this.dataSource.filteredData, o.columnProp);
      });

      this.table.toArray().forEach(data => data.renderRows());
      this.dataSource.filterPredicate = this.createFilter();

      setTimeout(() => { this.isWait = false; }, 600);
    }
  }

  doAction() {
    if (this.local_data.length != 0) {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    } else {
      this.local_data.length = 0
      this.dialogRef.close({ event: this.action, data: this.local_data });
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  changeSelection() {
    this.fetchSelectedItems()
  }

  selectedPosition(position) {
    this.selected_Position = position;
  }

  fetchSelectedItems() {
    this.selectedItemsList = this.checkboxesDataList.filter((value, index) => {
      return value.isChecked
    });

    if (this.start_Initial == 0) {
      this.local_data = this.selectedItemsList;
      this.start_Initial = 1;
    }

    if (this.start_Initial = 1) {


      if (this.local_data.length > this.matselectionNo) {
        this.ExceededSelection = true;

        let isConfirm = confirm('Category selection limit is ' + this.matselectionNo + ', you can not choose more than limit.');
        this.ExceededSelection = true;

        if (isConfirm) {
          this.checkboxesDataList.filter(x => {
            if (x.position == this.selected_Position && x.isChecked == true) {
              x.isChecked = false;
            }
          });

          this.dataSource.filteredData.filter(x => {
            if (x.position == this.selected_Position && x.isChecked == true) {
              x.isChecked = false;
            }
          });

          $('#' + this.selected_Position).prop('checked', false);
        }
        else {
          this.checkboxesDataList.filter(x => {
            if (x.position == this.selected_Position && x.isChecked == true) {
              x.isChecked = false;
            }
          });

          this.dataSource.filteredData.filter(x => {
            if (x.position == this.selected_Position && x.isChecked == true) {
              x.isChecked = false;
            }
          });

          $('#' + this.selected_Position).prop('checked', false);
        }

      }
      else {
        if ($('#' + this.selected_Position).prop('checked') == true) {
          const previous_data = this.local_data;

          if (this.local_data.length + 1 > this.matselectionNo) {
            let isConfirm = confirm('Category selection limit is ' + this.matselectionNo + ', you can not choose more than limit.');
            this.ExceededSelection = true;

            if (isConfirm) {
              this.checkboxesDataList.filter(x => {
                if (x.position == this.selected_Position && x.isChecked == true) {
                  x.isChecked = false;
                }
              });

              this.dataSource.filteredData.filter(x => {
                if (x.position == this.selected_Position && x.isChecked == true) {
                  x.isChecked = false;
                }
              });

              $('#' + this.selected_Position).prop('checked', false);
            }
            else {
              this.checkboxesDataList.filter(x => {
                if (x.position == this.selected_Position && x.isChecked == true) {
                  x.isChecked = false;
                }
              });

              this.dataSource.filteredData.filter(x => {
                if (x.position == this.selected_Position && x.isChecked == true) {
                  x.isChecked = false;
                }
              });

              $('#' + this.selected_Position).prop('checked', false);
            }
          }
          else {
            var temp_data = [];
            for (var product of previous_data) {
              temp_data.push({
                position: product.position,
                generalCategory: product.generalCategory,
                subCategory: product.subCategory,
                detailCategory: product.detailCategory,
                generalCode: product.generalCode,
                subCode: product.subCode,
                detailCode: product.detailCode,
                isChecked: true
              });
            }

            for (var i = 0; i < this.dataSource.filteredData.length; i++) {
              if (this.dataSource.filteredData[i].position == this.selected_Position &&
                this.dataSource.filteredData[i].isChecked == true) {
                temp_data.push({
                  position: this.dataSource.filteredData[i].position,
                  generalCategory: this.dataSource.filteredData[i].generalCategory,
                  subCategory: this.dataSource.filteredData[i].subCategory,
                  detailCategory: this.dataSource.filteredData[i].detailCategory,
                  generalCode: this.dataSource.filteredData[i].generalCode,
                  subCode: this.dataSource.filteredData[i].subCode,
                  detailCode: this.dataSource.filteredData[i].detailCode,
                  isChecked: true
                });
              }
            }

            this.local_data.length = 0;
            this.local_data = temp_data;
            this.selectedItemsList = this.local_data;

            if(this.dataSource.filteredData.length == 1){
              $('#selectAll').prop('checked', true);
            }
          }
        }
        else {
          this.local_data = this.local_data.filter(x => x.position != this.selected_Position);

          this.selectedItemsList = this.local_data;
          $('#selectAll').prop('checked', false);
        }
      }
    }
  }

  fetchCheckedIDs() {
    this.checkedIDs = []
    this.checkboxesDataList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedIDs.push(value.position);
      }
    });
  }

  applyFilter(filterValue) {
    $('#selectAll').prop('checked', false);
    this.all_selected = 0;

    let filter = {
      generalCategory: filterValue.trim().toLowerCase(),
      subCategory: filterValue.trim().toLowerCase(),
      detailCategory: filterValue.trim().toLowerCase(),
      topFilter: true
    }

    this.dataSource.filter = JSON.stringify(filter)
  }

  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

  removeSelectedItems(val) {
    $('#selectAll').prop('checked', false);
    this.local_data = this.local_data.filter(x => x.position != val);

    this.selectedItemsList = this.local_data;
    for (var i = 0; i < this.checkboxesDataList.length; i++) {
      if (this.checkboxesDataList[i].position == val) {
        this.checkboxesDataList[i].isChecked = false;
      }
    }

    for (var i = 0; i < this.dataSource.filteredData.length; i++) {
      if (this.dataSource.filteredData[i].position == val) {
        this.dataSource.filteredData[i].isChecked = false;
      }
    }

    if (this.local_data.length == 0) {
      this.selectAll = false;
    }

  }

  toggleAllSelection() {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.checkboxesDataList = this.dataSource.filteredData;
    var selectAllData = $('input[name="chk[]"]:checked').length > 0;

    if (selectAllData == true) {
      if (this.all_selected == 0) {
        this.selectedItemsList = this.checkboxesDataList;

        if ((this.local_data.length + this.checkboxesDataList.length > this.matselectionNo) && this.checkboxesDataList.length != 0) {
          this.ExceededSelection = true;

          let isConfirm = confirm('Category selection limit is ' + this.matselectionNo + ', you can not choose more than limit.');

          if (isConfirm) {

            for (var i = 0; i < this.local_data.length; i++) {
              this.checkboxesDataList.filter(x => {
                if (x.isChecked == true && x.position != this.local_data[i].position) {
                  x.isChecked = false;
                }
              });
            }

            var result = this.checkboxesDataList.filter(o => this.local_data.some(({ position }) => o.position === position));

            for (let i = 0; i < result.length; i++) {
              this.checkboxesDataList.filter(x => {
                if (x.isChecked == false && x.position != result[i].position) {
                  x.isChecked = true;
                }
              });
            }

            $('#selectAll').prop('checked', false);
          }
          else {
            for (var i = 0; i < this.local_data.length; i++) {
              this.checkboxesDataList.filter(x => {
                if (x.isChecked == true && x.position != this.local_data[i].position) {
                  x.isChecked = false;
                }
              });
            }

            var result = this.checkboxesDataList.filter(o => this.local_data.some(({ position }) => o.position === position));

            for (let i = 0; i < result.length; i++) {
              this.checkboxesDataList.filter(x => {
                if (x.isChecked == false && x.position != result[i].position) {
                  x.isChecked = true;
                }
              });
            }

            $('#selectAll').prop('checked', false);
          }
        }

        else if(this.checkboxesDataList.length == 0){
          // Swal.fire('Error !', 'No data available');

          $('#selectAll').prop('checked', false);
        }

        else {
          if (this.local_data.length != 0) {
            var temp_data = [];
            for (var product of this.local_data) {
              temp_data.push({
                position: product.position,
                generalCategory: product.generalCategory,
                subCategory: product.subCategory,
                detailCategory: product.detailCategory,
                generalCode: product.generalCode,
                subCode: product.subCode,
                detailCode: product.detailCode,
                isChecked: true
              });
            }

            const results = this.checkboxesDataList.filter(({ position: id1 }) => !this.local_data.some(({ position: id2 }) => id2 === id1));

            for (var product of results) {
              temp_data.push({
                position: product.position,
                generalCategory: product.generalCategory,
                subCategory: product.subCategory,
                detailCategory: product.detailCategory,
                generalCode: product.generalCode,
                subCode: product.subCode,
                detailCode: product.detailCode,
                isChecked: true
              });
            }
            // this.local_data = this.local_data.filter(x => x.position != this.checkboxesDataList[i].position);

            this.local_data.length = 0;
            this.local_data = temp_data;
            this.selectedItemsList = this.local_data;

            for (var product of this.local_data) {
              this.checkboxesDataList.filter(x => {
                if (product.position == x.position) {
                  x.isChecked = true;
                }
              })
            }

            for (var i = 0; i < this.dataSource.filteredData.length; i++) {
              if (this.dataSource.filteredData[i].isChecked == false) {
                this.dataSource.filteredData[i].isChecked = true;
              }
            }


            this.all_selected = 0

          }
          else {
            this.ExceededSelection = false;
            const previous_data = this.local_data;

            var temp_data = [];
            for (var product of previous_data) {
              temp_data.push({
                position: product.position,
                generalCategory: product.generalCategory,
                subCategory: product.subCategory,
                detailCategory: product.detailCategory,
                generalCode: product.generalCode,
                subCode: product.subCode,
                detailCode: product.detailCode,
                isChecked: true
              });
            }

            for (var product of this.selectedItemsList) {
              temp_data.push({
                position: product.position,
                generalCategory: product.generalCategory,
                subCategory: product.subCategory,
                detailCategory: product.detailCategory,
                generalCode: product.generalCode,
                subCode: product.subCode,
                detailCode: product.detailCode,
                isChecked: true
              });
            }

            this.local_data.length = 0;
            this.local_data = temp_data;
            this.selectedItemsList = this.local_data;

            for (var product of this.local_data) {
              this.checkboxesDataList.filter(x => {
                if (product.position == x.position && x.isChecked == false) {
                  x.isChecked = true;
                }
              })
            }

            this.all_selected = 0;
          }

        }
      }
      else if (this.all_selected == 1) {
        this.selectedItemsList = this.checkboxesDataList.filter((value, index) => {
          return value.isChecked
        });

        this.local_data = this.selectedItemsList;
        this.all_selected = 0;
      }
    }
    else {
      for (var i = 0; i < this.checkboxesDataList.length; i++) {
        if (this.checkboxesDataList[i].isChecked == true) {
          this.checkboxesDataList[i].isChecked = false;

          this.local_data = this.local_data.filter(x => x.position != this.checkboxesDataList[i].position);
        }
      }

      for (var i = 0; i < this.dataSource.filteredData.length; i++) {
        if (this.dataSource.filteredData[i].isChecked == true) {
          this.dataSource.filteredData[i].isChecked = false;
        }
      }
    }
  }
}