<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';

import Trash from '~/components/admin/Trash.vue'
import Edit from '~/components/admin/Edit.vue'

const physicians = ref([]);
const isLoading = ref(true);
const router = useRouter();

const fetchPhysicians = async () => {
  try {
    const response = await fetch('/api/physician', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    physicians.value = await response.json();
  } catch (error) {
    console.error('Error fetching physicians:', error);
  } finally {
    isLoading.value = false;
  }
};

async function deletePhysician(id) {
  const confirmed = window.confirm('คุณแน่ใจหรือว่าต้องการลบผู้ใช้นี้?');

  if (confirmed) {
    try {
      const response = await fetch(`/api/physician/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error deleting physician: ${response.statusText}`);
      }
      await response.json();
      await fetchPhysicians();
    } catch (error) {
      console.log('error : ' , error);
    }
  }
}

const editPhysician = (id: number) => {
  router.push(`/admin/physicians/edit/${id}`);
};

onMounted(async () => {
  await fetchPhysicians()
});

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <AdminLayout>
    <div class="container mx-auto p-4 bg-white">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="sm:text-5xl text-2xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการบุคลากรภายในคลินิก
        </h2>
      </div>

      <div class="mb-5">
        <nuxt-link to="/admin/physicians/create"
          class="btn btn-accent w-full text-white font-light mt-5">เพิ่มข้อมูล</nuxt-link>
      </div>

      <div class="overflow-x-auto">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <!-- Display table once data is fetched -->
        <table v-else class="table">
          <thead>
            <tr>
              <th>
                <p class="text-center">ลำดับ</p>
              </th>
              <th>
                <p class="text-center">คำนำหน้า</p>
              </th>
              <th>
                <p class="text-center">ชื่อ</p>
              </th>
              <th>
                <p class="text-center">นามสกุล</p>
              </th>
              <th>
                <p class="text-center">ตำแหน่ง</p>
              </th>
              <th class=" hidden sm:block">
                <p class="text-center">เบอร์โทรศัพท์</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(physician, index) in physicians" :key="physician.id">
              <th>
                <p class="text-center">{{ index + 1 }}</p>
              </th>
              <td>
                <p class="text-center">{{ physician.title }}</p>
              </td>
              <td>
                <p class="text-center">{{ physician.first_name }}</p>
              </td>
              <td>
                <p class="text-center">{{ physician.last_name }}</p>
              </td>
              <td>
                <p class="text-center">{{ physician.about }}</p>
              </td>
              <td class="hidden sm:block">
                <p class="text-center">{{ physician.phone }}</p>
              </td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button class="btn" @click="deletePhysician(physician.id)">
                    <Trash />
                  </button>
                  <button class="btn btn-accent" @click="editPhysician(physician.id)">
                    <Edit />
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
