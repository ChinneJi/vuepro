import axios from '@/store/axios'

export default{
	state:{
		clazzList:null
	},
	getters:{
		getClazzList:state=>state.clazzList
	},
	mutations:{
		alterClazzList:(state,data)=>{
			state.clazzList = data;
		},
		/*alterClazzListByGradeId:(state,data)=>{
			state.clazzList = data;
		}*/

	},
	actions:{
		//批量删除
		batchDeleteClazz:(context,ids)=>{
			return new Promise((resolve,reject)=>{
				axios.post('/clazz/batchDelete',{ids:ids})
				.then(({data})=>{
					if(data.status==200){
						resolve(data);	
					}else{
						reject(data);
					}
				})
				.catch((error)=>{
					reject(error);
				});
			});
		},
		//通过id删除班级信息
		deleteClazzById:(context,id)=>{
			return new Promise((resolve,reject)=>{
				axios.get('/clazz/deleteById',{params:{id}}).then(({data})=>{
					if(data.status==200){
						resolve(data);
					}else{reject (data)}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//保存并更新班级信息
		saveOrUpdateClazz:(context,clazz)=>{
			return new Promise((resolve,reject)=>{
				axios.post('/clazz/saveOrUpdate',clazz).then(({data})=>{
					if(data.status=200){
						resolve(data)
					}else{
						reject(data);
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		
		//当选择年级时，级联更新班级列表
		updateClazz:(context,id)=>{
			return new Promise((resolve,reject)=>{
				axios.get('/clazz/findVMById',{params:{id}}).then(({data})=>{
					if(data.status=200){
						//提交突变，改变页面状态
						context.commit('alterClazzList',data.data);
						resolve(data.data);
					}else{
						reject(data);
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//查询所有班级信息（级联操作）
		findAllClazz:(context,id)=>{
			return new Promise((resolve,reject)=>{
				axios.get('/clazz/findAllVM',{params:{id}}).then(({data})=>{
					if(data.status==200){
						//提交突变，改变clazzList的状态
						context.commit('alterClazzList',data.data);
						resolve(data.data);
					}else{
						reject(data);
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		
		
	}
}
