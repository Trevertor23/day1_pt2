import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
var app = new Vue({
    el:'#z1',
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
})