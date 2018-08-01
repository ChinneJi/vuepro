<template>
	<div class="course">
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
				<el-button @click='toAddCourse' size='small'>添加</el-button>
				<el-button size='small' @click='toBatchDelete'>批量删除</el-button>
		</el-col>
	</el-row>
	<!-- 第一行结束 -->
	<!-- 第二行 -->
		<el-row>
			<el-col :span='24'>
				<el-table
				    v-loading='courseTblLoading'
					size='mini'
					border
				    ref="multipleTable"
				    :data="getCourseList"
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
			      label="课程名称">
			    </el-table-column>
			    <el-table-column
			      prop="period"
			      label="课程周期">
			    </el-table-column>
			    <el-table-column
			      align='center'
			      prop="description"
			      label="课程信息描述">
			    </el-table-column>
			    <!-- <el-table-column
			      align='center'
			      prop=""
			      label="适用年级">
			    </el-table-column> -->
			   <el-table-column
			    	width='120'
			    	align='center'
			      label="操作">
			      <template slot-scope='scope'>
			      	<el-button type='text' @click='toEditCourse(scope.row)'>修改</el-button>
			      	<el-button type='text' @click='toDeleteCourse(scope.row)'>删除</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			</el-col>
		</el-row>
	<!-- 添加课程、修改课程模态 -->
		<el-dialog
		  :title="courseDialog.title"
		  :visible.sync="courseDialog.visible"
		  :before-close="handleCourseDialogClose">
		  {{courseDialog.form}}
			<el-form 
				ref='courseDialogForm'
				:rules='courseDialog.rules'
				:model='courseDialog.form' 
				label-position='right'
				label-width='100px'>	
				<el-form-item label='课程名称' prop='name'>
					<el-input v-model='courseDialog.form.name'></el-input>
				</el-form-item>	
				<el-form-item label='课程周期' prop='period'>
					<el-select  v-model='courseDialog.form.period'>
						<el-option 
							v-for='item in getPeriodList'
							:value="item.value"
							:key="item.value"
							:label="item.label">
						</el-option> 
						<!-- <el-option label="4周" value="4"></el-option>
		      			<el-option label="5周" value="5"></el-option>
		      			<el-option label="6周" value="4"></el-option>
		      			<el-option label="7周" value="5"></el-option> -->
					</el-select>
				</el-form-item>		
				<el-form-item label='课程介绍' prop='description'>
					<el-input type='textarea' v-model='courseDialog.form.description'></el-input>
				</el-form-item>		
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="courseDialog.visible = false">取 消</el-button>
		    <el-button type="primary" @click="submitCourseForm">保存</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script type="text/javascript">
import{mapGetters,mapActions} from 'vuex'
	export default{
		data(){
			return{
				getPeriodList:[{
					value:'4周',
					label:'4周'},
					{
					value:'5周',
					label:'5周'},
					{
					value:'6周',
					label:'6周'},
					],
				selectedCourses:[],
				currentGradeId:'',
				courseTblLoading:false,
				courseDialog:{
					title:'',
					visible:false,
					form:{
						id:'',
						name:'',
						period:'',
						description:''
					}
				}
			}
		},
		created(){
			this.loadCourseList();
			this.findAllGrade();
		},
		computed:{
			...mapGetters([
				'getGradeList',
				'getCourseList']),
		},
		methods:{
			...mapActions([
				'findAllGrade',
				'findAllCourses',
				'saveOrUpdateCourse',
				'deleteCourseById',
				'batchDeleteCourse'
				]),
			//加载课程数据
			loadCourseList(){
				//查询所有课程信息
				this.courseTblLoading = true;
				this.findAllCourses().catch((error)=>{
					this.$notify({title: '失败', message: '数据异常:'+error.message, type: 'error'});
				}).finally(()=>{
					this.courseTblLoading = false;
				});
			},
			//根据年级改变，更新列表
			gradeChange(){

			},
			//批量删除
			toBatchDelete(){
				if (this.selectedCourses && this.selectedCourses.length>0) {
					this.$confirm('此操作将永远删除这些数据,是否继续？','提示',{confirmButtonText:'确定',
						cancelButtonText:'取消',
						type:'warning'}).then(()=>{
							//2.获取要删除的id
							let ids = this.selectedCourses.map((item)=>{
								return item.id;
							})
							//3.调用接口进行删除
							this.batchDeleteCourse(ids.join()).then(()=>{
								this.$notify({type: 'success', message: '删除成功!'});
									this.loadCourseList();
							});
						})
				}else{
					this.$notify({type: 'warning', message: '请选中要删除的数据!'})
				}
			},
			//添加
			toAddCourse(){
				//1. 弹出模态框
				this.courseDialog.title = '添加课程';
				this.courseDialog.visible = true;
				//2. 初始化或者是重置模态框中的默认值
				this.courseDialog.form.id = '';
				this.courseDialog.form.name = '';
				this.courseDialog.form.period = '';
				this.courseDialog.form.description = '';
			},
			//提交课程表单
			submitCourseForm(){
				let course = this.courseDialog.form;
				this.saveOrUpdateCourse(course).then(()=>{
					this.courseDialog.visible = false;
				});
				this.loadCourseList();
			},
			//去修改课程
			toEditCourse(row){
				//1.弹出模态框
				this.courseDialog.title = '修改课程';
				this.courseDialog.visible = true;
				this.courseDialog.form = row;
			},
			//去删除课程
			toDeleteCourse(row){
				//1.询问用户是否删除
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	//2.确定删除，调用store中的函数，删除
        	this.deleteCourseById(row.id).then(()=>{
        		this.$notify({type:'success',message:'删除成功！'});
        	//3.刷新列表
        	this.loadCourseList();
        	}).catch(()=>{
        		this.$notify({type:'error',message:'删除失败！'});
        	});
        });
				
			},
			handleSelectionChange(val){
				this.selectedCourses = val;
			},
			handleCourseDialogClose(done){
				this.$refs['courseDialogForm'].resetFields();
				done();
			}
		}
	}
</script>