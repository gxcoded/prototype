import StudentSignUpForm from './StudentSignUpForm'
import StaffSignUpForm from './StaffSignUpForm'
import GuestSignUpForm from './GuestSignUpForm'


const ManipulateSignUp = ({userType,campus,vaxStatsList,genderList}) =>{
   
    
    switch(userType){
        case 1: return <StaffSignUpForm campus={campus} />
        case 2: return <StudentSignUpForm campus={campus} genderList={genderList} vaxStatsList={vaxStatsList} />
        case 3: return <GuestSignUpForm campus={campus} genderList={genderList} vaxStatsList={vaxStatsList}/>
        
        default: return null;
    }
 
   
}
export default ManipulateSignUp;
