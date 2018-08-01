import axios from '@/store/axios'

export default {
	state:{
		questionList:[]
	},
	getters:{
		getQuestionList:state=>state.questionList
	},
	mutations:{
		alterQuestionList:(state,questionList)=>{
			state.questionList = questionList;
		}
	},
	actions:{
		//查询所有题目类型
		findAllQuestionType:()=>{
			return new Promise((resolve,reject)=>{
				axios.get('/question/findAllQuestionType').then(({data})=>{
					if(data.status=200){	
						resolve(data.data);
					}else{
						reject(data);
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//通过关键字查询题目信息
		queryQuestion:(context,keywords)=>{
			return new Promise((resolve,reject)=>{
				axios.get('/question/queryVM',{params:{keywords}}).then(({data})=>{
					if(data.status=200){
						context.commit('alterQuestionList',data.data);
						resolve(data.data);
					}else{
						reject(data);
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 查询所有问题
		findAllQuestion:(context)=>{
			return new Promise((resolve,reject)=>{
				 axios.get('/question/findAllVM').then(({data})=>{
					if(data.status == 200){
						context.commit('alterQuestionList',data.data);
						resolve(data.data);
					} else {
						reject(data);
					}
				}).catch((error)=>{reject(error)});
			});
		}
	}
}






