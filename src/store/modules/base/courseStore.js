import axios from '@/store/axios'
export default{
	state:{
		courseList:null
	},
	getters:{
		getCourseList:state=>state.courseList
	},
	mutations:{
		alterCourseList:(state,data)=>{
			state.courseList = data;
		}
	},
	actions:{
		//批量删除
		batchDeleteCourse:(context,ids)=>{
			return new Promise((resolve,reject)=>{
				axios.post('/course/batchDelete',{ids:ids}).then(({data})=>{
					if(data.status==200){
						resolve(data)
					}else{reject(data)}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//根据id删除课程信息
		deleteCourseById:(context,id)=>{
			return new Promise((resolve,reject)=>{
				axios.get('/course/deleteById',{params:{id}}).then(({data})=>{
					if (data.status==200) {
						resolve(data);
					}else{reject(data)}
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//保存并更新课程信息
		saveOrUpdateCourse:(context,course)=>{
			return new Promise((resolve,reject)=>{
				axios.post('/course/saveOrUpdate',course).then(({data})=>{
					if (data.status=200) {
						resolve(data);
					}else{
						reject(data);
					}
					}).catch((error)=>{
						reject(error);
					});
			});
		},
		
		//查询所有课程信息
		findAllCourses:(context)=>{
			return new Promise((resolve,reject)=>{
				return axios.get('/course/findAll').then(({data})=>{
					if(data.status==200){
						//提交突变，改变clazzList的状态
						context.commit('alterCourseList',data.data);
						resolve(data.data);
					}else{
						reject(data)
					}
				}).catch((error)=>{
					reject(error);
				});
			});
		}
	}
}