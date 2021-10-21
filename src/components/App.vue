<template>
   <div>
       <h1>Variant 5 (1)</h1>
        <table>
                <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Group</th>
                    <th>Mark</th>
                    <th>PR is Done</th>
                </tr>
                <tr v-for="stud in students" v-bind:key="stud._id">
                    <td><img v-bind:src="stud.photo" width="50px"></td>
                    <td v-bind:style="stud.name.indexOf(search)>-1 && search.length >0 ? 'background-color:#CA2C2C' : 'background-color:#fff'">{{stud.name}}</td>
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
            <br> input Group: <input v-model="group">
            <br> Pr Is Done: <input type="checkbox" v-model="isDonePr">
            <br><button v-on:click="addStudent">Add student</button>

            <p><h3>Update student</h3>
            <br>Input Name: <input v-model="name1">
            <br> input Group: <input v-model="group1">
            <br> Pr Is Done: <input type="checkbox" v-model="isDonePr1">
            <br><button v-on:click="updateStudent()">Update student</button>

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
            <br>{{result}}   
   </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import VueAxios from 'vue-axios'
 
   export default {
        data: function() {
           return {
            name:"",
            group:"",
            isDonePr:false,
            name1:"",
            group1:"",
            isDonePr1:false,
            studId:"",
            students: [],
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
        }},
        mounted: function(){
            axios.get("http://46.101.212.195:3000/students").then((response)=>{
                console.log(response.data);
                this.students = response.data;
            })
            axios.get("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5").then((response)=>{
                console.log(response.data);
                this.currency = response.data;
            })
            
        },
        methods:{
        
        addStudent:function(){
            Vue.axios.post("http://46.101.212.195:3000/students", {
                name: this.name,
                group: this.group,
                isDonePr: this.isDonePr,
            })
            .then((response) => {
                console.log(response.data)
            })
            axios.get("http://46.101.212.195:3000/students").then((response)=>{
                this.students = response.data;
            })
            this.reload = "RELOAD THE PAGE!";
        },
        deleteStudent:function(id){
            Vue.axios.delete("http://46.101.212.195:3000/students/"+id, {
            })
            axios.get("http://46.101.212.195:3000/students").then((response)=>{
                this.students = response.data;
            })
            this.reload = "RELOAD THE PAGE!";
        },
        getData: function(id,name,group,isDone){
            this.studId = id;
            this.name1 = name;
            this.group1 = group;
            this.isDonePr1 = isDone;
        },
        updateStudent:function(){
            Vue.axios.put("http://46.101.212.195:3000/students/"+this.studId, {
                 name: this.name1,
                group: this.group1,
                isDonePr: this.isDonePr1,
            })
            axios.get("http://46.101.212.195:3000/students").then((response)=>{
                this.students = response.data;
            })
            this.reload = "RELOAD THE PAGE!";
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
            this.result = this.start_value + " " + this.start_ccy + " --> " + this.end_value + " " + this.end_ccy;
            
        }
        }
    }
</script>
<style scoped>

</style>