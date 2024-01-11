import { useState } from 'react';
import { Container, Button, Form, Image } from 'react-bootstrap';
import './style.scss';
import { BiUserPlus } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { IUserData } from '../../interfaces/user.interface';
import { registerUser } from '../../services/user';
import { PiEye, PiEyeClosedDuotone } from "react-icons/pi";

const Signup = () => {
    const [userData, setUserData] = useState<IUserData>({
        name: '',
        email: '',
        password: ''
    });

    const handleUserData = (e: any) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }

    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleConfirmPassword = (e: any) => setConfirmPassword(e.target.value);

    async function signUp() {
        if(userData.name && userData.email && userData.password && confirmPassword) {
            if(confirmPassword === userData.password) {
                return await registerUser(userData).then((response: any) => {
                    if(response.success) {
                        return alert(response.message);
                    }
                    return alert(response.message);
                });
            }
            return alert("Password's doesn't match !");
        }
        return alert("please fill all fields !");
    }

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);

    const handleIsPasswordVisible = () => setIsPasswordVisible(!isPasswordVisible);
    const handleIsConfirmPasswordVisible = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    return (
        <Container className='container signup-container'>
            <div className='form-field signup-form-field'>
                <Form className='form-container'>
                    <h2>Registre-se <BiUserPlus /></h2>

                    <Form.Group className='mt-5'>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type='text' name='name' placeholder='Digite o seu nome...' onChange={handleUserData}/>
                    </Form.Group>

                    <Form.Group className='mt-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='text' name='email' placeholder='Digite o seu email...' onChange={handleUserData}/>
                    </Form.Group>

                    <Form.Group className='mt-3'>
                        <Form.Label>Senha</Form.Label>
                        <div className='d-flex'>
                            <Form.Control type={isPasswordVisible ? 'text' : 'password'} name='password' placeholder='Crie uma senha...' onChange={handleUserData} />
                            <Button variant='' onClick={handleIsPasswordVisible}>
                                {isPasswordVisible ? <PiEyeClosedDuotone/> : <PiEye />}
                            </Button>
                        </div>
                    </Form.Group>

                    <Form.Group className='mt-3'>
                        <Form.Label>Confirme sua senha</Form.Label>
                        <div className='d-flex'>
                            <Form.Control type={isConfirmPasswordVisible ? 'text' : 'password'} placeholder='Agora confirme a sua senha...' value={confirmPassword} onChange={handleConfirmPassword} />
                            <Button variant='' onClick={handleIsConfirmPasswordVisible}>
                                {isConfirmPasswordVisible ? <PiEyeClosedDuotone/> : <PiEye/>}
                            </Button>
                        </div>
                    </Form.Group>

                    <Button variant='primary' className='w-100 mt-5' onClick={signUp}>Salvar</Button>
                    <p className='mt-4'>Retornar para <Link to="/">Login</Link></p>
                </Form>
            </div>
            <div className='img-field img-signup-field'>
                <Image className="w-75 img-signup" src='/assets/welcome_cats.svg' />
            </div>
        </Container>
    );
}

export default Signup;