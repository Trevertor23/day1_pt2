<template>
   <div>
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
                </tr>
            </table>
            <br>Введіть потрібне прізвище: <input v-model="search">
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
        data:{
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
        },
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
        deleteRow:function(id){
                this.students =  this.students.filter(stud => stud.id!=id)
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