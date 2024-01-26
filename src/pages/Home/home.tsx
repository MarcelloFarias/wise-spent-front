import { useEffect, useState } from 'react';
import './style.scss';
import Header from '../../components/Header/header';
import {
    Card,
    Container,
    Row,
    Badge,
    Button,
    ListGroup
} from 'react-bootstrap';
import { getUser } from '../../services/user';
import { getSpentByUserId } from '../../services/spent';
import Chart from 'react-google-charts';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaTrash } from 'react-icons/fa';
import { MdOutlineEdit } from "react-icons/md";
import Footer from '../../components/Footer/footer';
import { Spent } from '../../interfaces/spent.interface';
import DeleteSpentModal from '../../components/DeleteSpentModal/deleteSpentModal';
import RegisterSpentModal from '../../components/RegisterSpentModal/registerSpentModal';

const Home = () => {
    const today: Date = new Date();

    const getCurrentMonth = () => {
        switch (today.getMonth()) {
            case 0:
                return 'janeiro';
            case 1:
                return 'fevereiro';
            case 2:
                return 'março';
            case 3:
                return 'abril';
            case 4:
                return 'maio';
            case 5:
                return 'junho';
            case 6:
                return 'julho';
            case 7:
                return 'agosto';
            case 8:
                return 'setembro';
            case 9:
                return 'outubro';
            case 10:
                return 'novembro';
            case 11:
                return 'dezembro';
            default:
                return '';
        }
    }

    const [spents, setSpents] = useState<Spent[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            getUser(token).then((response: any) => {
                if (response?.success) {
                    getSpentByUserId(response?.user.id).then((response: any) => {
                        if (response.success) {
                            setSpents(response?.spents);
                        }
                    });
                    localStorage.setItem('id', response?.user.id.toString());
                }
            });
        }
    }, []);

    const chartData: Array<any> = new Array(["Gasto", "Valor"]);

    spents.forEach((spent: any) => {
        return chartData.push([spent.name, spent.value]);
    });

    const chartOptions: any = {
        title: `Meus gastos de ${getCurrentMonth()}`,
    };

    const [isDeleteSpentModalVisible, setIsDeleteSpentModalVisible] = useState<boolean>(false);

    const handleDeleteSpentModalVisibility = () => setIsDeleteSpentModalVisible(!isDeleteSpentModalVisible);

    const [spentIdToDelete, setSpentIdToDelete] = useState<number>(0);

    const handleSpentIdToDelete = (spentId: number) => {
        setSpentIdToDelete(spentId);
        handleDeleteSpentModalVisibility();
    }

    const [isRegisterSpentModalVisible, setIsRegisterSpentModalVisible] = useState<boolean>(false);

    const handleRegisterSpentModalVisibility = () => setIsRegisterSpentModalVisible(!isRegisterSpentModalVisible);

    return (
        <>
            <Header />
            <Container className='container'>
                <Row>
                    <Chart
                        chartType='PieChart'
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={chartOptions}
                    />
                </Row>
            
                <Row className='mt-5'>
                    <div className='spent-list-title d-flex justify-content-between mb-3'>
                        <h2>Todos os meus gastos</h2>
                        <Button variant='success' onClick={handleRegisterSpentModalVisibility}>Registrar um gasto</Button>
                    </div>
                    {spents?.length > 0 ? (
                        <ListGroup className='border-0'>
                            {spents?.map((spent: any) => {
                                return (
                                    <ListGroup.Item key={spent.id} className='border-0'>
                                        <Card className='p-3'>
                                            <Card.Title className='d-flex align-items-center justify-content-between'>
                                                <div className='d-flex align-items-center'>
                                                    {spent.name}
                                                    <Badge bg={spent.status === 'pago' ? 'success' : 'warning'} className='ms-2'>{spent.status}</Badge>
                                                </div>
                                                <Button variant='' className='text-info fs-4'>
                                                    <IoIosInformationCircleOutline />
                                                </Button>
                                            </Card.Title>
                                            <Card.Body className='d-flex align-items-center justify-content-between'>
                                                <h3>R$ {spent.value.toString().replace('.', ',')}</h3>
                                                <div>
                                                    <Button variant='outline-warning' className='me-2'>
                                                        <MdOutlineEdit />
                                                    </Button>
                                                    <Button variant='danger' onClick={() => handleSpentIdToDelete(spent?.id)}>
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    ) : (
                        <p className='text-center mt-4'>Você ainda não possui gastos registrados</p>
                    )}
                </Row>
            </Container>
            <Footer />

            <DeleteSpentModal
                isVisible={isDeleteSpentModalVisible}
                toggleVisibility={handleDeleteSpentModalVisibility}
                spentId={spentIdToDelete}
                setSpents={setSpents}
                spents={spents}
            />

            <RegisterSpentModal
                isVisible={isRegisterSpentModalVisible}
                toggleVisibility={handleRegisterSpentModalVisibility}
                setSpents={setSpents}
            />
        </>
    );
}

export default Home;