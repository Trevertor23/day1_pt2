<template>
   <div>
        <link rel="stylesheet" id="theme" v-bind:href="chosenTheme == 'light' ? './theme1.css' : './theme2.css'">
       <input type="radio" name="theme_r" value="light" v-on:click="choseTheme('light')">Light<br>
        <input type="radio" name="theme_r" value="dark" v-on:click="choseTheme('dark')">Dark
       <div v-if="zoom" style="width: 100%;height:100%; background: rgba(0, 0, 0, 0.4);position:fixed;">
                    <div v-if="zoom">
                        <div style="display:flex;margin-top:15%;justify-content:center;">
                            <img v-bind:src="this.photoId" style="background-color:#fff;">
                            <br><button v-on:click="unzoomImage">OK</button>
                        </div>
                    </div>
                    </div>
       <h1>Variant 5 (1)</h1>
        Students count - {{studentsCount}}            
        <table>
                <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Group</th>
                    <th>Mark</th>
                    <th>PR is Done</th>
                </tr>
                <tr v-for="stud in students" v-bind:key="stud._id">
                    <td>
                        <button v-on:click="zoomImage(stud.photo)"><img v-bind:src="stud.photo" width="50px"></button>
                    </td>
                    <td v-bind:style="stud.name.indexOf(search)>-1 && search.length >0 ? 'background-color:#CA2C2C' : 'background-color:#fff'">
                        <router-link v-bind:to="'/student-info/'+stud._id">
                            {{stud.name}}
                        </router-link>
                    </td>
                    <td>{{stud.group}}</td>
                    <td>{{stud.mark}}</td>
                    <td><input type="checkbox" v-bind:checked="stud.isDonePr"></td>
                    <td><a href="#" v-on:click="deleteStudent(stud._id)">Видалити</a></td>
                    <td><button v-on:click="getData(stud._id,stud.name,stud.group,stud.isDonePr)"><img src="components/Black_pencil.svg" width="25px"></button></td>
                </tr>
            </table><h1>{{reload}}</h1>
            <br>Введіть потрібне прізвище: <input v-model="search">
            <p><h3>Add new student</h3>
            <br>Input Name: <input v-model="name">
            <br> Input Group:
             <select name="group" v-model="group">
                <option value="RPZ 18 1/9">RPZ 18 1/9</option>
                <option value="RPZ 18 2/9">RPZ 18 2/9</option>
            </select>
            <br> Pr Is Done: <input type="checkbox" v-model="isDonePr">
            <br><button v-on:click="addStudent">Add student</button>

            <p><h3>Update student</h3>
            <br>Input Name: <input v-model="newStudent.name">
            <br> Input Group: 
            <select name="group" v-model="newStudent.group">
                <option value="RPZ 18 1/9">RPZ 18 1/9</option>
                <option value="RPZ 18 2/9">RPZ 18 2/9</option>
            </select>
            <br> Pr Is Done: <input type="checkbox" v-model="newStudent.isDonePr">
            <br><button v-on:click="updateStudent()" v-bind:style="showInput ? 'display:inline' : 'display:none'">Update student</button>

			<hr>
            <h2>Converter</h2>
            
            <br>Enter amount: <input type="number" value="100" v-model="start_value">
            <br>Convert from (choose ONE)
            <table>
                <tr>
                    <th>RUB</th>
                    <th>USD</th>
                    <th>EUR</th>
                </tr>
                <tr>
                    <td><input type="checkbox" value="RUR" v-model="start_ccy_r"></td>
                    <td><input type="checkbox" value="USD" v-model="start_ccy_u"></td>
                    <td><input type="checkbox" value="EUR" v-model="start_ccy_e"></td>
                </tr>
            </table>{{start_ccy}}
            to (choose ONE)
            <table>
                <tr>
                    <th>RUB</th>
                    <th>USD</th>
                    <th>EUR</th>
                </tr>
                <tr>
                    <td><input type="checkbox" value="RUR" v-model="end_ccy_r"></td>
                    <td><input type="checkbox" value="USD" v-model="end_ccy_u"></td>
                    <td><input type="checkbox" value="EUR" v-model="end_ccy_e"></td>
                </tr>
            </table>
            <button v-on:click="convert">Convert</button>
            <br>{{result}}{{end_value | roundValue}}{{end_ccy}}   
   </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import VueAxios from 'vue-axios'
 
   export default {
       props:{
           id: '',
       },
        data: function() {
           return {
            name:"",
            group:"",
            isDonePr:false,
            showInput:false,
            students: [],
            newStudent: {},
            currency:[],
            search:"",
            start_ccy:"",
            start_ccy_r:false,
            start_ccy_u:false,
            start_ccy_e:false,
            end_ccy:"",
            end_ccy_r:false,
            end_ccy_u:false,
            end_ccy_e:false,
            sell:0,
            buy:0,
            start_value:0,
            end_value:0,
            result:"",
            reload:"",

            photoId:"",
            zoom:false,
        }},
        mounted: function(){
            
                axios.get("http://46.101.212.195:3000/students").then((response)=>{
                    console.log(response.data);
                    this.students = response.data;
                    this.$store.commit('setCount',this.students.length);
                })
                axios.get("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5").then((response)=>{
                    console.log(response.data);
                    this.currency = response.data;
                })
            
        },
        methods:{
            choseTheme: function(theme){
                this.$store.commit('setTheme', theme);
            },
            zoomImage: function(photo){
                this.photoId = photo;
                this.zoom = true;
            },
            unzoomImage: function(){
                this.photoId = '';
                this.zoom = false;
            },
            addStudent:function(){
                Vue.axios.post("http://46.101.212.195:3000/students", {
                    name: this.name,
                    group: this.group,
                    isDonePr: this.isDonePr,
                })
                .then((response) => {
                    console.log(response.data)
                })
                this.students.push({photo:this.students[1].photo,mark:0,name: this.name, group: this.group, isDonePr:this.isDonePr});
                this.reload = "";
                
            },
            deleteStudent:function(id){
                Vue.axios.delete("http://46.101.212.195:3000/students/"+id, {
                })
                this.reload = "";
                let i = this.students.indexOf(id);
                this.students.splice(i,1)
            },
            getData: function(id,name,group,isDone){
                this.newStudent.id = id;
                this.newStudent.name = name;
                this.newStudent.group = group;
                this.newStudent.isDonePr = isDone;
                this.showInput = true;
            },
            updateStudent:function(){
                Vue.axios.put("http://46.101.212.195:3000/students/"+this.newStudent.id, {
                    name: this.newStudent.name,
                    group: this.newStudent.group,
                    isDonePr: this.newStudent.isDonePr,
                })
                this.reload = "RELOAD THE PAGE!";
                this.showInput = false;
                console.log(this.newStudent.name)
            
            },
            convert:function(){
                if(this.start_ccy_e==true) this.start_ccy = "EUR"
                else if (this.start_ccy_u==true) this.start_ccy = "USD"
                else if (this.start_ccy_r==true) this.start_ccy = "RUR"
                else return false;

                if(this.end_ccy_e==true) this.end_ccy = "EUR"
                else if (this.end_ccy_u==true) this.end_ccy = "USD"
                else if (this.end_ccy_r==true) this.end_ccy = "RUR"
                else return false;

                for(let i=0; i<this.currency.length; i++){
                    if (this.currency[i].ccy==this.start_ccy)
                            this.sell=this.currency[i].sale;
                    if (this.currency[i].ccy==this.end_ccy)
                            this.buy=this.currency[i].buy;
                }
                this.end_value=(this.start_value*this.sell)/this.buy;
                this.result = this.start_value + " " + this.start_ccy + " --> ";
                
            }
        },
        filters:{
            roundValue: function(value){
                return parseFloat(value.toFixed(2));
            },
        },
        computed: {
            studentsCount () {
                return this.$store.getters.getCount
            },
            chosenTheme(){
                return this.$store.getters.getTheme
            },
        }

    }
</script>
<style scoped>

</style>