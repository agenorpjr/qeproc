'use server'
import { revalidatePath } from "next/cache";
import db from "../db/db";

//===============================================================================
// USER
//===============================================================================

export async function getApproverByUserId(id: any) {
    const user = await db.user.findFirst({
        where: {
            approver_id: id
        }
    })
    return user?.approver_id
}

export async function getApprovers() {
    const approvers = await db.user.findMany()
    return approvers
}

export async function getCompanies() {
    const companies = await db.companies.findMany()
    return companies
}
export async function getDeliveries() {
    const deliveries = await db.delivery_addresses.findMany()
    return deliveries
}

export async function getCostCenters() {
    const cost_centers = await db.cost_centers.findMany()
    return cost_centers
}

export async function getProjects() {
    const projects = await db.projects.findMany()
    return projects
}

export async function getMeasures() {
    const measures = await db.measures.findMany({
        orderBy: {
            measure: 'asc',
        },
    })
    revalidatePath("/user/order")
    return measures
}

export async function getProducts() {
    const products = await db.products.findMany({
        orderBy: {
            description: 'asc'
        }
    })
    revalidatePath("/user/order")
    return products
}



export async function addProductoOnTable(data: any) {
    const adp = await db.products.create({
        data: {
            description: data.description
        }
    })
    revalidatePath("/user/order")
    return adp
}



//===============================================================================
// DRAFTS
//===============================================================================

export async function getDrafts(user_id: string) {
    const drafts = db.drafts.findMany({
        where: {
            user_id: user_id
        },
        include: {
            companies: true,
            draft_products_list: {
                include: {
                    products: true,
                    measures: true
                }
            }
        }
    })
    return drafts
}

export async function getDraftId(dn) {
    const di = await db.drafts.findFirst({
        where: {
            draft_number: dn
        }
    })
    return di?.draft_id
}

export async function getDraftNumber() {
    const draft = await db.drafts.findMany({
        orderBy: {
            draft_id: 'desc',
        },
        take: 1,
    })
    return draft[0].draft_number
}


export async function getDraftById(id) {
    const draft = await db.drafts.findFirst({
        where: {
            draft_id: id
        },
        include: {
            draft_products_list: {
                include: {
                    measures: true,
                    products: true,
                }
            },
            companies: true,            
        }
    })
    if (draft?.project_id !== 0) {
        const proj = await db.projects.findFirst({
            where: {
                project_id: draft?.project_id
            }
        })
        Object.assign(draft, proj)
    }

    if (draft?.cost_center_id !== 0) {
        const cc = await db.cost_centers.findFirst({
            where: {
                cost_center_id: draft?.cost_center_id
            }
        })
        Object.assign(draft, cc)
    }
    
    return draft
}

export async function updateDraft(savedata: any, dn: Number) {
    const draftn = await getDraftId(dn)
    const sd = await db.drafts.update({
        where: {
            draft_id: draftn
        },
        data: {
            company_id: savedata.company_id,
            delivery_address: savedata.delivery_address,
            cost_center_id: savedata.cost_center_id,
            project_id: savedata.project_id,
            delivery_at: savedata.delivery_at,
            draft_status: "enable"
        }
    })
    revalidatePath("/user/order")
}

export async function addDraftNumber(draftnumber: string, user_id: string) {
    const dn = await db.drafts.create({
        data: {
            draft_number: draftnumber,
            user_id: user_id,
        }
    })
}

export async function deleteDraftById(dId) {
    const di = await db.drafts.delete({
        where: {
            draft_id: dId
        }
    })
}


//===============================================================================
// DRAFT_PRODUCTS_LIST
//===============================================================================

export async function getDraftsProducts(draft_id) {
    const dp = await db.draft_products_list.findMany({
        where: {
            draft_id: draft_id
        },
        include: {
            products: {
                include: {
                    draft_products_list: draft_id,
                },
            },
            measures: {
                include: {
                    order_products_list: draft_id
                }
            }

        }
    })
    revalidatePath("/user/order")
    return dp
}

export async function addDraftProduct(dataproduct: any) {
    const adp = await db.draft_products_list.create({
        data: {
            draft_id: dataproduct.draft_id,
            product_id: dataproduct.product_id,
            measure_id: dataproduct.measure_id,
            quantity: parseInt(dataproduct.quantity),
            reference: dataproduct.reference,
            obs: dataproduct.obs
        }
    })
    revalidatePath("/user/order")
}

export async function editDraftProduct(dataproduct: any) {
    const edp = await db.draft_products_list.update({
        where: {
            draft_product_list_id: dataproduct.draft_product_list_id
        },
        data: {
            product_id: dataproduct.product_id,
            measure_id: dataproduct.measure_id,
            quantity: dataproduct.quantity,
            reference: dataproduct.reference,
            obs: dataproduct.obs
        }
    })
}

export async function deleteDraftProduct(dataproduct: any) {
    const ddp = await db.draft_products_list.delete({
        where: {
            draft_product_list_id: dataproduct
        }
    })
}

export default async function revPath() {
    revalidatePath('/user/order')
}


//===============================================================================
// ORDERS
//===============================================================================

export async function getOrderNumber() {

    try {
        const order = await db.orders.findMany({
            orderBy: {
                order_id: 'desc',
            },
            take: 1,
        })
        return order[0].order_number
    } catch(err) {
        return 0
    }
}

export async function getOrderById(on: any) {
    const orderid = await db.orders.findFirst({
        where: {
            order_number: on
        }
    })

    return orderid?.order_id
}

export async function createOrder(values: any) {
    const co = await db.orders.create({
        data: {
            order_number: values.order_number,
            user_id: values.user_id,
            company_id: values.company_id,
            delivery_address: values.delivery_address,
            project_id: values.project_id,
            cost_center_id: values.cost_center_id,
            approver_id: values.approver_id,
            delivery_at: values.delivery_at
        }
    })
}

export async function getOrders(user_id: string) {
    const orders = db.orders.findMany({
        where: {
            user_id: user_id
        },
        include: {
            companies: true,
            order_products_list: {
                include: {
                    products: true,
                    measures: true
                }
            }
        }
    })
    return orders
}
//===============================================================================
// ORDER_PRODUCTS_LIST
//===============================================================================

export async function updateOrderProductsList(values: any) {
    const uopl = await db.order_products_list.create({
        data: {
            order_id: values.order_id,
            product_id: values.product_id,
            measure_id: values.measure_id,
            quantity: values.quantity,
            reference: values.reference,
            obs: values.obs
        }
    })
}


//===============================================================================
// PROJECTS
//===============================================================================

export async function getProjectId(projectName: string) {
    const proj = await db.projects.findFirst({
        where: {
            project: projectName
        }
    })
    if (!proj) {
        return null
    }
    return proj?.project_id
}

export async function getProjectById(project_id: number) {
    const proj = await db.projects.findFirst({
        where: {
            project_id: project_id
        }
    })

    return proj?.project_id
}

export async function addProject(projectName: string) {
    const addproj = await db.projects.create({
        data: {
            project: projectName
        }
    })
    return addproj.project_id
}