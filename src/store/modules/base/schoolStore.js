import axios from '@/store/axios.js'
export default{
	actions:{
		saveOrUpdateSchool:(context,school)=>{
			return new Promise((resolve,reject)=>{
				axios.post('/school/saveOrUpdate',school).then(({data})=>{
					if(data.status=200){
						//调用突变，改变state当中的值
						/*context.commit('alterSchool',data.data);*/
						resolve(data);//给承诺的调用者
					}else{
						reject(data);
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findSchool:(context,id=1)=>{
			return new Promise((resolve,reject)=>{
				axios.get('/school/findById',{params:{id}}).then(({data})=>{
					if(data.status=200){
						
						//调用突变，改变state当中的值
						/*context.commit('alterSchool',data.data);*/
						resolve(data);//给承诺的调用者，findSchool
					}else{
						reject(data);
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		}
	}
}