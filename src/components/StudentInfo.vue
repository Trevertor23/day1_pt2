<template>
    <div>
        Students count - {{studentsCount}}<br>     
        {{student.name}}
        <img v-bind:src="student.photo">
    </div>
</template>
<script>
    import Vue from 'vue'

    export default {
        props:{
            id: '',
        },
        data:function(){
            return{
                student:{},
            };
        },
        mounted:function(){
            Vue.axios.get("http://46.101.212.195:3000/students/"+this.id).then((response)=> {
                console.log(response.data);
                this.student = response.data;
                this.$store.commit('setCount',1);
            })
        },
        computed: {
            studentsCount () {
                return this.$store.getters.getCount
            }
        }
    }
</scripts>