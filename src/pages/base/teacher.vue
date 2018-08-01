<template>
	<div class="teacher">
		<!-- 第一行 ,按钮层-->
	<el-row class='topBtns'>
		<el-col :span='6'>
			<el-select
				size='small' 
				v-model="currentGradeId" 
				placeholder="请选择年级"
				@change='gradeChange'>
			      <el-option
			        v-for="item in getGradeList"
			        :key="item.id"
			        :label="item.name"
			        :value="item.id">
			      </el-option>   
  			</el-select>
		</el-col>
		<el-col :span='6'>
			<!-- 从服务器搜索数据，输入关键字进行查找 -->
			<el-input 
				size='small'  
				placeholder="请输入关键字搜索" 
				style='width:180px'>
			</el-input>
		</el-col>
		<el-col :span='12' class='content-right'>	
			<el-button @click='toAddTeacher' size='small'>添加</el-button>
			<el-button size='small' @click='toBatchDelete'>批量删除</el-button>	
		</el-col>
	</el-row>
	<!-- 第一行结束 -->
	<!-- 第二行开始 -->
	<el-row>
			<el-col :span='24'>
				<el-table
					v-loading='teacherTblLoading'
					size='mini'
					border
				    ref="multipleTable"
				    :data="getTeacherList"
				    tooltip-effect="dark"
				    style="width: 100%"
				    @selection-change="handleSelectionChange">
			    <el-table-column
			      align='center'
			      label="编号"
			      width='55'
			      type="selection">
			    </el-table-column> 
			    <el-table-column
			      align='center'
			      prop="name"
			      label="教师姓名">
			    </el-table-column>
			    <el-table-column
			    align='center'
			    prop="gender"
			    label="性别">
			    </el-table-column>
			    <el-table-column
			     align='center'
			      prop="birth"
			      label="出生日期">
			    </el-table-column>
			    <el-table-column
			     align='center'
			      prop="grade.name"
			      label="所属年级">
			    </el-table-column>
			    <el-table-column
			      align='center'
			      prop="hiredate"
			      label="入职时间">		     
			    </el-table-column>
			    <el-table-column
			      align='center'
			      label="操作"
			      width='120px'>
			
			      <!-- 内部组件，存放局部作用于插槽 -->
			      <template slot-scope='scope'>
			      	<el-button type='text' @click='toReviewTeacher(scope.row)'><i class="fa fa-align-justify"></i></el-button>
			      	<el-button type='text' @click='toEditTeacher(scope.row)'><i class="fa fa-pencil"></i></el-button>
			      	<el-button type='text' @click='toDeleteTeacher(scope.row)'><i class="fa fa-remove"></i></el-button>

			      </template>    
			    </el-table-column>
			  </el-table>
			</el-col>
		</el-row>

	<!-- 第二行结束-->
	<!-- 添加教师、修改教师模态框 -->
		<el-dialog
		  :title="teacherDialog.title"
		  :visible.sync="teacherDialog.visible"
		  :before-close="handleTeacherDialogClose">
		  {{teacherDialog.form}}
			<el-form 
				ref='teacherDialogForm'
				:rules='teacherDialog.rules'
				:model='teacherDialog.form' 
				label-position='right'
				label-width='100px'>
				<el-form-item label='教师姓名' prop='name'>
					<el-input v-model='teacherDialog.form.name'></el-input>
				</el-form-item>	
				<el-form-item label='教师性别' prop='gender'>
					<el-radio-group v-model="teacherDialog.form.gender">
					    <el-radio :label="'男'">男</el-radio>
					    <el-radio :label="'女'">女</el-radio>   
					</el-radio-group>
				</el-form-item>
				<el-form-item label='出生日期' prop='birth'>
					<!-- <el-input v-model='teacherDialog.form.birth'></el-input> -->
					<el-date-picker
				      v-model="teacherDialog.form.birth"
				      type="date"
				      placeholder="选择日期">
    				</el-date-picker>
				</el-form-item>

				<el-form-item label='入职时间' prop='hiredate'>
					<!-- <el-input  v-model='teacherDialog.form.hiredate'></el-input> -->
					<el-date-picker
				      v-model="teacherDialog.form.hiredate"
				      type="date"
				      placeholder="选择日期">
    				</el-date-picker>
				</el-form-item>
				<el-form-item label='所属年级' prop='grade'>
					<!-- <el-input v-model='teacherDialog.form.grade'></el-input> -->
					<el-select style="width:100%" value-key='id' v-model='teacherDialog.form.gradeId'>
				<el-option 
				    :key='grade.id'
				    :label='grade.name' 
				    :value='grade.id' 
				    v-for='grade in gradeList'>
				</el-option>
			</el-select> 
				</el-form-item>			
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="teacherDialog.visible = false">取 消</el-button>
		    <el-button type="primary" @click="submitTeacherForm">保存</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script type="text/javascript">
import {mapGetters,mapActions} from 'vuex'
	export default{
		data(){
			return{
				teacherTblLoading:false,
				currentGradeId:"",
				teacherList:[],
				gradeList:[],
				selectedTeachers:[],//复选的奇偶暗示信息
				//维护模态框中的数据
				teacherDialog:{
					visible:false,		//可见性
					title:'', 				//标题
					form:{ 						//表单数据
						id:'',
						name:'',
						gender:'',
						birth:'',
						gradeId:'',
						hiredate:''
					},
					rules:{						//校验规则
						name:[{required:true,message:'请输入教师名称',trigger:'blur'}],
						gender:[{required:true,message:'请输入性别',trigger:'blur'}],
						birth:[{required:true,message:'请输入出生日期',trigger:'blur'}],
						gradeId:[{required:true,message:'请输入所属年级',trigger:'blur'}],
						hiredate:[{required:true,message:'请输入入职时间',trigger:'blur'}]		
					}
				}
				
					
			  }
		},
		created(){
			//加载年级列表
			this.findAllGrade().then((result)=>{
				this.gradeList = result;
			});
			//加载所有教师列表
			this.loadTeacherList();
		},
		computed:{
			...mapGetters(['getTeacherList','getGradeList'])
		    },
		methods:{
			...mapActions(['findAllTeacher','updateTeacher','findAllGrade','saveOrUpdateTeacher','deleteTeacherById','batchDeleteTeacher']),
			// 去添加教师数据
			toAddTeacher(){
				//1. 弹出模态框
				this.teacherDialog.title = '添加教师信息';
				this.teacherDialog.visible = true;			
				//2. 初始化或者是重置模态框中的默认值
				this.teacherDialog.form.id = '';
				this.teacherDialog.form.name = '';
				this.teacherDialog.form.gender = '';
				this.teacherDialog.form.birth = '';
				this.teacherDialog.form.hiredate = '';
				this.teacherDialog.form.gradeId = '';
			},
			// 提交教师表单
			submitTeacherForm(){
				console.log(this);
				//0. 数据校验
				this.$refs['teacherDialogForm'].validate((valid)=>{
					if(valid){
						//1. 向后台发送数据
						let teacher = this.teacherDialog.form;
						this.saveOrUpdateTeacher(teacher).then(()=>{
							//2. 当添加成功，提示用户，然后关闭模态框
							this.$notify({title: '成功', message: '教师信息保存成功', type: 'success'});
							this.loadTeacherList();
							this.$refs['teacherDialogForm'].resetFields();
							this.teacherDialog.visible = false;
						}).catch(()=>{
							//3. 当添加失败，提示用户，不关闭模态框
							this.$notify({title: '失败', message: '年级信息保存失败', type: 'error'});
						});
					} 
				});		
			},
			//去预览
			toReviewTeacher(){

			},
			// 去修改教师数据
			toEditTeacher(row){
				//1. 弹出模态框
				this.teacherDialog.title = '修改教师信息';
				this.teacherDialog.visible = true;
				this.teacherDialog.form = row;  
				console.log('edit',JSON.stringify(row));
			},
			//去批量删除教师
			toBatchDelete(){
				if(this.selectedTeachers && this.selectedTeachers.length>0){
					//1, 询问用户是否删除
					this.$confirm('此操作将永久删除这些数据, 是否继续?','提示',{
					  confirmButtonText: '确定', 
			          cancelButtonText: '取消',
			          type: 'warning'
				}).then(()=>{
					//2.获取要删除的id
					let ids = this.selectedTeachers.map((item)=>{
						console.log(ids);
						return item.id;
					});
					//3.调用接口进行删除
					this.batchDeleteTeacher(ids.join()).then(()=>{
					this.$notify({type:'success',message:'删除成功！'});
					this.loadTeacherList();
					});
				});
			}else{
				this.$notify({type:'warning',message:'请选中要删除的数据!'});
			}
				},
			// 去删除教师数据
			toDeleteTeacher(row){
				// console.log('delete',JSON.stringify(row));
				//1, 询问用户是否删除
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	// 2. 确定删除，调用store中的函数，删除
        	this.deleteTeacherById(row.id).then(()=>{
          	this.$notify({type: 'success', message: '删除成功!'});
          	//3. 刷新列表
          	this.loadTeacherList();
        	}).catch(()=>{
          	this.$notify({type: 'error', message: '删除失败!'});
        	});
        })

			},
			gradeChange(){
				//更新教师列表
				this.updateTeacher(this.currentGradeId).then(()=>{
					//刷新班级列表
					this.loadTeacherList();
				});	
			},
			//去加载所有教师信息
			loadTeacherList(){
				//现加载
				this.teacherTblLoading = true;
				//查询所有老师信息
				this.findAllTeacher().catch((error)=>{
					this.$notify({title: '失败', message: '数据异常:'+error.message, type: 'error'});
				}).finally(()=>{
					this.teacherTblLoading = false;
				});
			},
			handleSelectionChange(val) {
        		this.selectedTeachers = val;
      		},

      		handleTeacherDialogClose(done){
      			this.$refs['teacherDialogForm'].resetFields();
      			done();
      			}
			}	
	}
	
</script>