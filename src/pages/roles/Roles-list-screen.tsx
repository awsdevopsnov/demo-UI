import React, { useEffect, useState } from 'react';
import RolesGridDataUi from './Roles-table-data'
import { Add } from '@mui/icons-material';
import { useDeleteRoleMutation, useGetRoleQuery, useUpdateRoleMutation } from '../../redux-store/role/roleApi';
import TableHeader from '../../components/layouts/TableHeader';
import usePathname from '../../hooks/usePathname';
import DialogBoxUi from '../../components/ui/DialogBox';
import RoleForm from './Roles-form';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux-store/store';
import { toast } from 'react-toastify';
import { toastConfig } from '../../constants/forms/config/toastConfig';
import ToastUi from '../../components/ui/ToastifyUi'
import { useGetInvoiceQuery, useUpdateInvoiceMutation } from '../../redux-store/invoice/invcoiceApi';

const invoiceOptions = ["ADMIN", "APPROVER", "ENDUSER"]

const RolesDropdown = ({ params }: { params: GridRenderCellParams }) => {

    const [status, setStatus] = useState(params.value);
    const [updateRoles, { isSuccess: updateSuccess }] = useUpdateRoleMutation();
    const { data: rolesList, error, isLoading, refetch: fetchRolesList } = useGetRoleQuery();

    useEffect(() => {
        fetchRolesList();
    }, [updateSuccess])

    const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
        const newStatus = event.target.value as string;

        setStatus(newStatus);

        const updatedRoles = {
            ...params.row,
            userRole: newStatus,
        };

        console.log("Updating invoice with payload:", updatedRoles);

        try {
            const response = await updateRoles({ id: updatedRoles.id, roles: updatedRoles });
            console.log("Update response:", response);
            if ('error' in response) {
                console.error("Error updating invoice status:", response.error);
            } else {
                console.log(`Invoice status updated: ${newStatus}`);
            }
        } catch (error) {
            console.error('Error updating invoice status:', error);
        }
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            style={{ fontSize: "12px", padding: "5px 5px", borderRadius: "5px" }}
        >
            {invoiceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    );
};


const RolesList: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [roleId, setRoleId] = useState<string | null>(null);
    const { data: roleDetails, refetch } = useGetRoleQuery();
    const pathname = usePathname();
    const [deleteRole] = useDeleteRoleMutation();

    const handleModalClose = () => {
        setOpenModal(false);
        refetch();
    };

    const handleAddClick = () => {
        setRoleId(null);
        setOpenModal(true);
        setOpenModal(true);
    }

    const buttons = [
        { label: 'Create Role', icon: Add, onClick: handleAddClick },
    ];

    const handleEditClick = (id: string) => {
        setRoleId(id);
        setOpenModal(true);
    }

    const handleDeleteClick = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this role?");
        if (confirmed) {
            await deleteRole(id);
            toast.success("Successfully deleted the selected role", toastConfig);
            refetch();
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'Action',
            headerName: 'Action',
            width: 140,
            renderCell: undefined,
        },
        {
            field: 'username',
            headerName: 'User Name',
            width: 150,
            editable: true,
        },
        // {
        //     field: 'userRole',
        //     headerName: 'User Role',
        //     width: 150,
        //     editable: true,
        // },
        {
            field: 'userEmail',
            headerName: 'Email',
            width: 150,
            editable: true,
        },
        {
            field: 'userAccess',
            headerName: 'Access',
            width: 150,
            editable: true,
        },
        {
            field: 'userRole',
            headerName: 'User Role',
            width: 120,
            editable: true,
            type: "singleSelect",
            valueOptions: ["ADMIN", "APPROVER", "ENDUSER",],
            renderCell: (params: GridRenderCellParams) => (
                <RolesDropdown params={params} />
            ),
        },
    ];

    return (
        <>
            <ToastUi autoClose={1000} />
            <TableHeader headerName={pathname} buttons={buttons} />
            <RolesGridDataUi showToolbar={true} columns={columns || []} tableData={roleDetails || []} checkboxSelection={false} onRowEdit={(roleId) => handleEditClick(roleId)}
                onRowDelete={handleDeleteClick} />
            <DialogBoxUi
                open={openModal}
                content={<RoleForm roleId={roleId} onClose={handleModalClose} />}
                handleClose={handleModalClose}
            />
        </>
    );
};

export default RolesList;