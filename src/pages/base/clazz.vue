<template>
	<div class="clazz">
	<!-- 第一行 ,按钮层-->
	<el-row class='topBtns'>
		<el-col :span='6'>
			<el-select 
				v-model="currentGradeId" 
				placeholder="请选择年级" 
				size='small' 
				@change='gradeChange'>
			    <!-- label页面当中显示的值 -->
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
			<el-input size='small'  placeholder="请输入关键字搜索" style='width:180px'></el-input>
		</el-col>
		<el-col :span='12' class='content-right'>
				<el-button @click='toAddClazz' size='small'>添加</el-button>
				<el-button size='small' @click='toBatchDelete'>批量删除</el-button>
		</el-col>
	</el-row>
		<!-- 第二行 -->
		<el-row>
			<el-col :span='24'>
				<el-table
				    v-loading='clazzTblLoading'
					size='mini'
					border
				    ref="multipleTable"
				    :data="getClazzList"
				    tooltip-effect="dark"
				    style="width: 100%"
				    @selection-change="handleSelectionChange">
			    <el-table-column
			      align='center'
			      type="selection"
			      width='150'>
			    </el-table-column>
			    <el-table-column
			      align='center'
			      prop="name"
			      label="班级名称">
			    </el-table-column>
			    <el-table-column
			      prop="description"
			      label="班级介绍">
			    </el-table-column>
			    <el-table-column
			      align='center'
			      prop="charge.name"
			      label="班主任">
			    </el-table-column>
			   <el-table-column
			    	width='120'
			    	align='center'
			      label="操作">
			      <template slot-scope='scope'>
			      	<el-button type='text' @click='toEditClazz(scope.row)'>修改</el-button>
			      	<el-button type='text' @click='toDeleteClazz(scope.row)'>删除</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			</el-col>
		</el-row>

		<!-- 添加班级、修改班级模态 -->
		<el-dialog
		  :title="clazzDialog.title"
		  :visible.sync="clazzDialog.visible"
		  :before-close="handleClazzDialogClose">
		  {{clazzDialog.form}}
			<el-form 
				ref='clazzDialogForm'
				:rules='clazzDialog.rules'
				:model='clazzDialog.form' 
				label-position='right'
				label-width='100px'>
				<el-form-item label='所属年级' prop='grade'>
					<el-select  v-model='clazzDialog.form.gradeId' value-key='id'>
						<el-option 
							v-for='item in getGradeList'
							:value="item.id"
							:key="item.id"
							:label="item.name">
						</el-option>
					</el-select>
				</el-form-item>		
				<el-form-item label='班级名称' prop='name'>
					<el-input v-model='clazzDialog.form.name'></el-input>
				</el-form-item>	
				<el-form-item label='班主任' prop='charge'>
					<el-select  v-model='clazzDialog.form.chargeId' value-key='id'>
						<el-option 
							v-for='teacher in getTeacherList'
							:value="teacher.id"
							:key="teacher.id"
							:label="teacher.name">
						</el-option> 
					</el-select>
				</el-form-item>		
				<el-form-item label='班级介绍' prop='description'>
					<el-input type='textarea' v-model='clazzDialog.form.description'></el-input>
				</el-form-item>		
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="clazzDialog.visible = false">取 消</el-button>
		    <el-button type="primary" @click="submitClazzForm">保存</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script type="text/javascript">
import {mapGetters,mapActions} from 'vuex'
	export default{
		data(){
			return{
				clazzTblLoading:false,
				// id:'',
				selectedClazzs:[],	//复选的班级信息
				currentGradeId:"",
				//维护模态框中的数据
				clazzDialog:{
					visible:false,		//可见性
					title:'', 				//标题
					form:{ 						//表单数据
						id:'',
						gradeId:'',
						name:'',
						description:'',
						chargeId:''
					},
					rules:{	
					    gradeId:[{required:true,message:'请输入所属年级',trigger:'blur'}],					//校验规则
						name:[{required:true,message:'请输入班级名称',trigger:'blur'}],
						description:[{required:true,message:'请输入班级简介',trigger:'blur'}],
						chargeId:[{required:true,message:'请输入班主任',trigger:'blur'}]
					}
				}
			  }
		},
		created(){
			this.findAllGrade();
			
			//加载所有班级列表
			this.loadClazzList();
			//加载所有的老师数据
			this.findAllTeacher().then((result)=>{

				this.clazzTeacher = result;
			});

		},
		computed:{
			//从状态获取 store
			...mapGetters([
				'getClazzList',
				'getGradeList',
				'getTeacherList']),
		},
		methods:{
			...mapActions([
				'findAllGrade',
				'findAllClazz',
				'findAllTeacher',
				'updateClazz',
				'saveOrUpdateClazz',
				'deleteClazzById',
				'batchDeleteClazz']),
			//去批量删除
			toBatchDelete(){
				if (this.selectedClazzs && this.selectedClazzs.length>0) {
					//1.询问用户是否删除
					this.$confirm('此操作将永久删除这些数据, 是否继续?','提示',{
					  confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
				}).then(()=>{
					//2.获取要删除的id
					let ids = this.selectedClazzs.map((item)=>{		
						return item.id;
					});
					//3.调用接口进行删除
					this.batchDeleteClazz(ids.join()).then(()=>{
					this.$notify({type:'success',message:'删除成功！'});
					this.loadClazzList();
					});
				});
				}else{
					this.$notify({type: 'warning', message: '请选中要删除的数据!'});
				}

			},
			//去删除班级数据
			toDeleteClazz(row){
				
				//1, 询问用户是否删除
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {	
        	// 2. 确定删除，调用store中的函数，删除
        	this.deleteClazzById(row.id).then(()=>{
          	this.$notify({type: 'success', message: '删除成功!'});
          	//3. 刷新列表
          	this.loadClazzList();
        	}).catch(()=>{
          	this.$notify({type: 'error', message: '删除失败!'});
        	});
       })
				
			},			
			
				
			// 去添加班级数据
			toAddClazz(){
				//1. 弹出模态框
				this.clazzDialog.title = '添加班级';
				this.clazzDialog.visible = true;
				
				//2. 初始化或者是重置模态框中的默认值
				this.clazzDialog.id='';
				this.clazzDialog.name='';
				this.clazzDialog.gradeId='';
				this.clazzDialog.description='';
				this.clazzDialog.chargeId='';
			},
			// 提交班级表单
			submitClazzForm(){
				
				//0. 数据校验
				this.$refs['clazzDialogForm'].validate((valid)=>{
					if(valid){
						//1. 向后台发送数据
						let clazz = this.clazzDialog.form;
						this.saveOrUpdateClazz(clazz).then(()=>{
							//2. 当添加成功，提示用户，然后关闭模态框
							this.$notify({title: '成功', message: '年级信息保存成功', type: 'success'});
							this.loadClazzList();
							this.$refs['clazzDialogForm'].resetFields();
							this.clazzDialog.visible = false;

						}).catch(()=>{
							this.$notify({title:'失败',message:'班级信息保存失败',type:'error'});
						});
						
						//3. 当添加失败，提示用户，不关闭模态框
						
					} 
				});	
			},
			// 去修改班级数据
			toEditClazz(row){
				//1. 弹出模态框
				this.clazzDialog.title = '修改年级';
				this.clazzDialog.visible = true;
				this.clazzDialog.form = row;
				console.log('edit',JSON.stringify(row));
			},
			//当选择年级时，级联更新班级列表
			gradeChange(){
				//更新班级
				this.updateClazz(this.currentGradeId).then(()=>{
					//刷新班级列表
					// this.clazzList = result;
					this.loadClazzList();
				});	
			},
			//去加载班级数据
			loadClazzList(){
				//先加载
				this.clazzTblLoading=true;
				//再查询所有班级信息
				this.findAllClazz().catch((error)=>{
					this.$notify({title: '失败', message: '数据异常:'+error.message, type: 'error'});	
				}).finally(()=>{
					this.clazzTblLoading = false;
				});	
			},
			//批量删除时选中的ids		
			handleSelectionChange(val) {
	               this.selectedClazzs = val;
	        },
		    handleClazzDialogClose(done){
		      	this.$refs['clazzDialogForm'].resetFields();
		      	done();
		      }
				}
		
	}
</script>