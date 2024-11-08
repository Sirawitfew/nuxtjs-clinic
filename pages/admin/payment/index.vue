<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';

import Trash from '~/components/admin/Trash.vue'
import Edit from '~/components/admin/Edit.vue'


const isLoading = ref(true);
const router = useRouter();

const payment = ref([]);

const fetchPayments = async () => {
  try {
    const response = await fetch('/api/payment', {
      method: 'GET',
    });
    const data = await response.json();
    payment.value = data.body;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
};

const confirmPayment = async (id: number) => {
  try {
    const response = await fetch('/api/payment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'success' }),
    });
    if (response.ok) {
      // Update the local state for immediate feedback
      const updatedPayment = await response.json();
      const index = payment.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        payment.value[index].status = updatedPayment.body.status;
      }
    } else {
      console.error('Failed to confirm payment');
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
  }
};

const deletePayment = async (id: number) => {
  if (confirm('คุณต้องการลบการชำระเงินนี้หรือไม่?')) {
    try {
      const response = await fetch(`/api/payment?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        payment.value = payment.value.filter(p => p.id !== id);
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  }
};

onMounted(async () => {
  await fetchPayments();
});

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <AdminLayout>
    <div class="container mx-auto p-4 bg-white">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="sm:text-5xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">การชำระเงิน</h2>
      </div>

      <div class="overflow-x-auto mt-5">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <!-- Display table once data is fetched -->
        <table v-else class="table mt-5">
          <thead>
            <tr>
              <th>
                <p class="text-center">ลำดับ</p>
              </th>
              <th>
                <p class="text-center">ชื่อลูกค้า</p>
              </th>
              <th>
                <p class="text-center">หมายเลขสินค้า</p>
              </th>
              <th>
                <p class="text-center">ราคาทั้งหมด</p>
              </th>
              <th>
                <p class="text-center">จ่ายแบบ</p>
              </th>
              <th>
                <p class="text-center">สถานะ</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payment, index) in payment" :key="payment.id">
              <td>
                <p class="text-center">{{ index + 1 }}</p>
              </td>
              <td>
                <p class="text-center">{{ payment.diagnosis?.patient?.firstname }} {{
                  payment.diagnosis?.patient?.lastname }}</p>
              </td>
              <td>
                <p class="text-center">{{ payment.orderNumber }}</p>
              </td>
              <td>
                <p class="text-center">{{ payment.totalAmount }} บาท</p>
              </td>
              <td>
                <p class="text-center">{{ payment.paymentMethod }}</p>
              </td>
              <td>
                <p v-if="payment.status === 'pending'" class="text-center">กำลังรอ</p>
                <p v-else class="text-center">เสร็จสิ้น</p>
              </td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button @click="deletePayment(payment.id)" class="btn">
                    <Trash />
                  </button>
                  <!-- <button class="btn btn-accent">
                    <p class="font-light text-white">ดูเพิ่มเติม</p>
                  </button> -->
                  <button v-if="payment.status === 'pending'" @click="confirmPayment(payment.id)"
                    class="btn btn-secondary">
                    <p class="font-light text-white">ยืนยันการชำระเงิน</p>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.table th {
  background-color: #f4f4f4;
  font-size: small;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
