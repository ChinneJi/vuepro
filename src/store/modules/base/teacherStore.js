import axios from '@/store/axios'

export default{
	state:{
		teacherList:null
	},
	getters:{
		getTeacherList:state=>state.teacherList	
	},
	mutations:{
		alterTeacherList:(state,data)=>{
			state.teacherList = data;
		}
	},
	actions:{
		//批量删除教师信息
		batchDeleteTeacher:(context,ids)=>{
			return new Promise((resolve,reject)=>{
				axios.post('/user/batchDelete',{params:{ids}}).then(({data})=>{
					if (data.status == 200) {
						resolve(data);
					}else{
						reject(data);
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//根据id删除教师信息
		deleteTeacherById:(context,id)=>{
			return new Promise((resolve,reject)=>{
				axios.get('/user/deleteById',{params:{id}}).then(({data})=>{
					if(data.status == 200){
						resolve(data);
					}else{reject(data)}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//保存或更新教师信息
		saveOrUpdateTeacher:(context,teacher)=>{
			return new Promise((resolve,reject)=>{
				axios.post('/user/saveOrUpdate',teacher).then(({data})=>{
					if(data.status=2000){
						resolve(data)
					}else{
						reject(data);
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		
		//当选择年级时，级联更新教师列表
		updateTeacher:()=>{
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
		//级联查询所有老师信息
		findAllTeacher:(context)=>{
			return new Promise((resolve,reject)=>{
				 axios.get('/user/findAllVM').then(({data})=>{
					if(data.status=200){
						context.commit('alterTeacherList',data.data);
						resolve(data.data);
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
