<template>
    <div class="content-wrapper">
        <div id="purchase-order">
            <page-header titleName="Purchase Order" :isCreate="true"></page-header>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
					<el-date-picker
                        class="date-range-picker"
                        v-model="dateRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        :format="format"
                        :value-format="format">
					</el-date-picker>
					<el-select
						style="margin-left: 0;"
						v-model="storeFilter"
						placeholder="Pilih Toko"
						filterable>
						<el-option value="" label="">Semua Toko</el-option>
						<el-option
							v-for="(dataStoreFilter, indexStoreFilter) in itemsDataStore"
							:key="indexStoreFilter"
							:label="dataStoreFilter.name"
							:value="dataStoreFilter.id">
						</el-option>
					</el-select>
					<el-button class="button-outline-green float-right" @click.prevent="getExcel" round>
						<img :src="require('@/assets/images/icons/download-new.png')" v-if="(loadingExcel == false)">
						<div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
					</el-button>
                </div>
                <el-alert
                    v-if="messagesuccess"
                    title=""
                    type="success"
                    :description="messagesuccess"
                    show-icon></el-alert>
				<div class="filterstatus">
					<el-tabs v-model="filterQuery">
						<el-tab-pane label="Semua Status" name=" "></el-tab-pane>
						<el-tab-pane label="Pending" name="pending"></el-tab-pane>
						<el-tab-pane label="Partial" name="partial"></el-tab-pane>
						<el-tab-pane label="Success" name="success"></el-tab-pane>
					</el-tabs>
				</div>
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column label="Purchase Order Number" width="120" prop="number"></el-table-column>
					<el-table-column label="Buyer/Toko" width="140">
						<template slot-scope="scope">
							<div v-if="scope.row.buyer !== ''"><b>{{scope.row.buyer}}</b></div>
							<div v-else>-</div>
							<div v-if="scope.row.store">{{scope.row.store.name}}</div>
						</template>
					</el-table-column>
					<el-table-column label="Payment Method" width="90" prop="payment_method"></el-table-column>
					<el-table-column label="Nama Sales" width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.seller !== ''">{{scope.row.seller}}</div>
							<div v-else>-</div>
						</template>
					</el-table-column>
					<el-table-column label="Type" width="90" prop="type"></el-table-column>
					<el-table-column label="Status" width="90" prop="status"></el-table-column>
					<el-table-column label="Total" prop="total" width="130">
						<template slot-scope="scope">
							Rp. {{formatPrice(scope.row.total)}}
						</template>
					</el-table-column>
					<el-table-column width="100" label="Created At">
						<template slot-scope="scope">
							{{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
						</template>
					</el-table-column>
					<el-table-column width="100" label="Updated At">
						<template slot-scope="scope">
							{{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}
						</template>
					</el-table-column>
					<el-table-column label="Actions" align="center">
						<template slot-scope="scope">
							<a href="#" style="margin-right: 5px;" @click.prevent="handleCurrentChange(scope.row)">
								<el-tooltip class="item" effect="dark" content="Edit" placement="top">
									<font-awesome-icon class="fontIcons" :icon="fontsIcons.edit" />
								</el-tooltip>
							</a>
							<a href="#" @click.prevent="printPO(scope.row)">
								<el-tooltip class="item" effect="dark" content="Print Purchase Order" placement="top">
									<font-awesome-icon class="fontIcons" :icon="fontsIcons.print" />
								</el-tooltip>
							</a>
						</template>
					</el-table-column>
                </el-table>
                <div class="mobayar-actions-bottom clearfix">
                    <div class="showing-page float-left">
                        <span>View</span>
                        <ul>
                            <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                            <li><a href="#" @click.prevent="limitChange('25', $event)">25</a></li>
                            <li><a href="#" @click.prevent="limitChange('50', $event)">50</a></li>
                            <li><a href="#" @click.prevent="limitChange('100', $event)">100</a></li>
                        </ul>
                    </div>
                    <div class="pagination-result float-right">
                        <span>Showing results 1 - {{itemsData.length}} of {{parseInt(totalPage)}}</span>
                        <el-pagination
                            layout="prev, pager, next"
                            :total="parseInt(totalPage)"
                            @current-change="pageChange"
                            :page-size="parseInt(limit)">
                        </el-pagination>
                    </div>
                </div>
                <div class="base-template-sidebar">
                    <loading-svg :isLoading="loadingForm"></loading-svg>
                    <div class="content" v-if="itemDataDetail">
                        <header class="clearfix">
                            <h4>{{titleForms}}</h4>
                            <el-button id="cancel" @click="closeModal()"><img :src="require('@/assets/images/icons/big-close.png')"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
											<el-col :span="24">
												<el-form-item v-if="formsType == 'create'" label="Tipe Purchase Order">
													<el-radio-group v-model="forms.type_po">
														<el-radio label="new">New</el-radio>
														<el-radio label="old">Old</el-radio>
													</el-radio-group>
												</el-form-item>
											</el-col>
											<el-col :span="12" v-if="forms.type_po == 'old' && formsType == 'create'">
												<el-form-item label="PO Number">
													<el-input v-model="forms.number_old"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="12" v-if="forms.type_po == 'old' && formsType == 'create'">
												<el-form-item label="Created At">
													 <el-date-picker
														v-model="forms.created_at_old"
														type="datetime"
														format="yyyy-MM-dd HH:mm:ss"
														value-format="yyyy-MM-dd HH:mm:ss">
													</el-date-picker>
												</el-form-item>
											</el-col>
											<el-col :span="24">
                                                <el-form-item label="Tipe">
													<el-radio-group v-model="forms.type">
														<el-radio label="store">Store</el-radio>
														<el-radio label="user">User</el-radio>
													</el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="(forms.type !== 'user') ? 24 : 12">
                                                <el-form-item label="Warehouse" prop="warehouse">
                                                    <el-select
														v-model="forms.warehouse"
														@change="wareHouseItemChange">
														<el-option
															v-for="(dataWarehouse, indexWarehouse) in itemsDataWarehouse"
															:key="indexWarehouse"
															:value="dataWarehouse.id"
															:label="dataWarehouse.name"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="forms.type !== 'user'">
                                                <el-form-item label="Toko" prop="store">
													<el-select
														v-model="forms.store"
														:popper-append-to-body="false"
														class="custom-select-width"
														@change="storeChange"
														filterable>
														<el-option
                                                            v-for="itemStore in itemsDataStore"
                                                            :key="itemStore.id"
                                                            :label="itemStore.name"
                                                            :value="itemStore.id">
                                                            <b>{{itemStore.name}}</b><br>
                                                            {{itemStore.address}}
                                                        </el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Nomor Telepon">
													<el-input v-model="forms.phone" type="number"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Nama Sales">
													<el-input v-model="forms.seller"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Buyer">
													<el-input v-model="forms.buyer"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="24">
                                                <el-form-item label="Alamat">
													<el-input v-model="forms.address" type="textarea" rows="5"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="24">
                                                <el-form-item label="Note">
													<el-input type="textarea" rows="5" v-model="forms.note"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="24">
                                                <el-form-item label="Payment Method">
													<el-radio-group v-model="forms.payment_method">
														<el-radio label="top">Top</el-radio>
														<el-radio label="cash">Cash</el-radio>
														<el-radio label="konsinyasi">Konsinyasi</el-radio>
														<el-radio label="credit">Credit</el-radio>
													</el-radio-group>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="24" v-if="forms.payment_method == 'top' || forms.payment_method == 'konsinyasi'">
                                                <el-form-item label="Termin Payment Date">
													 <el-date-picker
													 	v-model="forms.termin_payment_date"
														format="yyyy-MM-dd"
														value-format="yyyy-MM-dd"
														type="date"></el-date-picker>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12" v-if="forms.payment_method == 'credit'">
                                                <el-form-item label="Credit Term">
													<el-input v-model="forms.credit_term"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12" v-if="forms.payment_method == 'credit'">
                                                <el-form-item label="Credit Provider">
													<el-select v-model="forms.credit_provider">
														<el-option
															v-for="(dataCredit, indexCredit) in itemsDataCreditProvider"
															:key="indexCredit"
															:value="dataCredit.id"
															:label="dataCredit.name"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="24">
												<h5 style="margin-top: 0;">Input Produk Item</h5>
												<div class="forms-details" style="position: relative;">
													<a href="#" v-if="formsType == 'create'" @click.prevent="addRow()" class="plus-items"><font-awesome-icon class="fontIcons" :icon="fontsIcons.plus" /></a>
													<a href="#" v-else @click.prevent="modalItemAdd = true" class="plus-items"><font-awesome-icon class="fontIcons" :icon="fontsIcons.plus" /></a>
													<el-table
														:data="formsProduct"
														max-height="370"
														empty-text="No data available in table"
														ref="singleTableItems"
														class="mobayar-table">
														<el-table-column width="140" label="Produk">
															<template slot-scope="scope">
																<div v-if="formsType == 'create'">
																	<el-button v-if="formsProduct[scope.$index].item_product_names == ''" round class="button-outline-green" @click.prevent="modalProduct = true;indexForProduct = scope.$index;">Pilih Produk</el-button>
																	<div v-else>
																		<span v-if="formsProduct[scope.$index].type_product == 'e-bike'">{{formsProduct[scope.$index].item_product_names}} - {{formsProduct[scope.$index].item_colour_names}}</span>
																		<span v-else>{{formsProduct[scope.$index].item_product_names}}</span>
																	</div>
																</div>
																<div v-else>
																	<span v-if="formsProduct[scope.$index].item_name">
																		{{formsProduct[scope.$index].item_name}}
																	</span>
																	<span v-if="formsProduct[scope.$index].item_colour">
																		- {{formsProduct[scope.$index].item_colour}}
																	</span>
																</div>
															</template>
														</el-table-column>
														<el-table-column width="120" label="Price">
															<template slot-scope="scope">
																<div v-if="formsType == 'create'" class="el-form-item__content custom-price-format">
																	<div class="el-input">
																		<money
																			:disabled="formsProductDisabled[scope.$index].item_prices"
																			v-model="formsProduct[scope.$index].item_prices"
																			v-bind="money"
																			class="el-input__inner"></money>
																	</div>
																</div>
																<div v-else>Rp. {{formatPrice(formsProduct[scope.$index].item_prices)}}</div>
															</template>
														</el-table-column>
														<el-table-column width="120" label="Discount">
															<template slot-scope="scope">
																<div v-if="formsType == 'create'" class="el-form-item__content custom-price-format">
																	<div class="el-input">
																		<money
																			:disabled="formsProductDisabled[scope.$index].item_discount"
																			v-model="formsProduct[scope.$index].item_discount"
																			v-bind="money"
																			class="el-input__inner"></money>
																	</div>
																</div>
																<div v-else>Rp. {{formatPrice(formsProduct[scope.$index].item_discount)}}</div>
															</template>
														</el-table-column>
														<el-table-column width="80" align="center" label="Qty">
															<template slot-scope="scope">
																<el-input v-if="formsType == 'create'" type="number" style="text-align: center;" v-model="formsProduct[scope.$index].item_qtys"></el-input>
																<span v-else>{{formsProduct[scope.$index].item_qtys}}</span>
															</template>
														</el-table-column>
														<el-table-column width="130" label="Total">
															<template slot-scope="scope">
																Rp. {{formatPrice(formsProduct[scope.$index].items_totals)}}
															</template>
														</el-table-column>
														<el-table-column width="60">
															<template slot-scope="scope">
																<el-tooltip class="item" v-if="formsProduct[scope.$index].item_add == true" effect="dark" content="Hapus Item Produk" placement="top">
																	<a href="#"
																		@click.prevent="removeProductInput(scope.$index)"
																		class="minus-items">
																			<font-awesome-icon class="fontIcons" :icon="fontsIcons.minus" />
																	</a>
																</el-tooltip>
																<el-tooltip class="item" v-else effect="dark" content="Hapus Item Produk" placement="top">
																	<a href="#"
																		v-if="itemDataDetail.status == 'pending'"
																		@click.prevent="
																		purchaseOrderId = itemDataDetail.id;
																		purchaseOrderItemId = formsProduct[scope.$index].items_ids;
																		deleteItemModal = true;
																		dataIndexDelete = scope.$index"
																		class="minus-items">
																			<font-awesome-icon class="fontIcons" :icon="fontsIcons.minus" />
																	</a>
																	<a href="#"
																		v-else
																		@click.prevent="$FUNCTIONS.notify('error', 'Error', 'Item tidak dapat dihapus karena sudah ada disurat jalan')"
																		class="minus-items">
																		<font-awesome-icon class="fontIcons" :icon="fontsIcons.minus" />
																	</a>
																</el-tooltip>
															</template>
														</el-table-column>
													</el-table>
													<!-- <pre>{{formsProduct}}</pre> -->
													<!-- <pre>{{dataDetailProdukEdit}}</pre> -->
													<!-- <pre>{{testing}}</pre> -->
												</div>
											</el-col>
											<el-col :span="24">
												<el-form-item label="Total Unit">
													<el-input-number :disabled="true" :min="0" v-model="totalUnit"></el-input-number>
												</el-form-item>
											</el-col>
											<el-col :span="12" v-if="forms.payment_method == 'credit'">
                                                <el-form-item label="Down Payment">
													<div class="el-form-item__content custom-price-format">
														<div class="el-input el-input-group el-input-group--prepend">
															<div class="el-input-group__prepend">Rp.</div>
															<money v-model="forms.down_payment" v-bind="money" class="el-input__inner"></money>
														</div>
													</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12" v-if="forms.payment_method == 'credit'">
                                                <el-form-item label="Biaya Kredit Tambahan">
													<div class="el-form-item__content custom-price-format">
														<div class="el-input el-input-group el-input-group--prepend">
															<div class="el-input-group__prepend">Rp.</div>
															<money v-model="forms.add_fee" v-bind="money" class="el-input__inner"></money>
														</div>
													</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Discount">
													<div class="el-form-item__content custom-price-format">
														<div class="el-input el-input-group el-input-group--prepend">
															<div class="el-input-group__prepend">Rp.</div>
															<money v-model="forms.discount" v-bind="money" class="el-input__inner"></money>
														</div>
													</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Tax">
													<div class="el-form-item__content custom-price-format">
														<div class="el-input el-input-group el-input-group--prepend">
															<div class="el-input-group__prepend">Rp.</div>
															<money v-model="forms.tax" v-bind="money" class="el-input__inner"></money>
														</div>
													</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Subtotal">
													<div class="el-form-item__content custom-price-format">
														<div class="el-input el-input-group el-input-group--prepend">
															<div class="el-input-group__prepend">Rp.</div>
															<money v-model="forms.subtotal" v-bind="money" class="el-input__inner"></money>
														</div>
													</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Total">
													<div class="el-form-item__content custom-price-format">
														<div class="el-input el-input-group el-input-group--prepend">
															<div class="el-input-group__prepend">Rp.</div>
															<money v-model="totalRealData" v-bind="money" class="el-input__inner"></money>
														</div>
													</div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img :src="require('@/assets/images/icons/trash.png')" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>

				<table border="1" style="width: 100%;display:none;" id="table-export-purchase-order">
					<thead>
						<tr>
							<th>Purchase Order Number</th>
							<th>Buyer</th>
							<th>Toko</th>
							<th>Payment Method</th>
							<th>Nama Sales</th>
							<th>Type</th>
							<th>Status</th>
							<th>Total Unit</th>
							<th>Total</th>
							<th>Created At</th>
							<th>Updated At</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(dataExport, indexExport) in itemDataExcel"
							:key="indexExport">
							<td>{{dataExport.number}}</td>
							<td>
								<span v-if="dataExport.buyer !== ''">{{dataExport.buyer}}</span>
								<span v-else>-</span>
							</td>
							<td>
								<span v-if="dataExport.store">
									<span v-if="dataExport.store_id !== ''">{{dataExport.store.name}}</span>
									<span v-else>-</span>
								</span>
								<span v-else></span>
							</td>
							<td>{{dataExport.payment_method}}</td>
							<td>
								<span v-if="dataExport.seller !== ''">{{dataExport.seller}}</span>
								<span v-else>-</span>
							</td>
							<td>{{dataExport.type}}</td>
							<td>{{dataExport.status}}</td>
							<td>{{dataExport.total_unit}}</td>
							<td>{{dataExport.total}}</td>
							<td>{{formatDate(dataExport.created_at)}} {{formatTime(dataExport.created_at)}}.</td>
							<td>{{formatDate(dataExport.updated_at)}} {{formatTime(dataExport.updated_at)}}.</td>
						</tr>
					</tbody>
				</table>
            </div>
			<el-dialog
				title="Input Produk"
				:visible.sync="modalItemAdd"
				width="45%"
				top="5vh"
				:close-on-click-modal="false"
				:close-on-press-escape="false"
				class="mb-dialog nopadding-right point-modal kepala-regional">
				<div class="content-dialog detail-pencapaian">
					<loading-svg :isLoading="loadingModal"></loading-svg>
					<el-alert
						v-if="messageErrorProduct"
						title="Error"
						type="error"
						:description="messageErrorProduct"
						show-icon></el-alert>
					<el-form :model="formsProductAdd" status-icon ref="formsvalidAddItem" label-width="120px" class="demo-ruleForm">
						<div class="item-forms-details">
							<div class="forms-details" style="margin-top: 0;">
								<el-row :gutter="20">
									<el-col :span="24" style="margin-bottom: 0px;">
										<el-form-item label="Tipe">
											<el-radio-group v-model="formsProductAdd.item_tipe">
												<el-radio
													v-for="(dataTypes, indexTypes) in itemsDataType"
													:key="indexTypes"
													:label="dataTypes.slug">{{dataTypes.name}}</el-radio>
											</el-radio-group>
										</el-form-item>
									</el-col>
									<div v-if="formsProductAdd.item_tipe !== ''">
										<el-col :span="24"
											v-for="(dataItems, indexItems) in itemsDataProduct"
											:key="indexItems"
											style="margin-bottom: 15px;">
											<el-form-item v-if="dataItems.label == 'e-bike' && formsProductAdd.item_tipe == 'e-bike'" label="Produk">
												<el-select
													v-model="formsProductAdd.item_product_id"
													@change="formsProductAdd.item_price = searchArray(formsProductAdd.item_product_id, dataItems.data).price"
													filterable>
													<el-option
														v-for="(dataProduct, indexProduct) in dataItems.data"
														:key="indexProduct"
														:label="dataProduct.name"
														:value="dataProduct.id">{{dataProduct.name}}</el-option>
												</el-select>
											</el-form-item>
											<el-form-item v-if="dataItems.label == 'spare-parts' && formsProductAdd.item_tipe == 'spare-parts'" label="Produk">
												<el-select
													v-model="formsProductAdd.item_product_id"
													filterable>
													<el-option
														v-for="(dataProduct, indexProduct) in dataItems.data"
														:key="indexProduct"
														:label="dataProduct.name"
														:value="dataProduct.id">{{dataProduct.name}}</el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="24" v-if="formsProductAdd.item_tipe == 'e-bike'">
											<el-form-item label="Warna">
												<el-select
													v-model="formsProductAdd.item_colour"
													@change="formsProductAdd.item_price = searchArray(formsProductAdd.item_product_id, dataItems.data).price"
													filterable>
													<el-option
														v-for="(dataColour, indexColour) in itemsDataColour"
														:key="indexColour"
														:label="dataColour.name"
														:value="dataColour.id">{{dataColour.name}}</el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</div>
									<el-col :span="12">
										<el-form-item label="Price">
											<div class="el-form-item__content custom-price-format">
												<div class="el-input">
													<money
														v-model="formsProductAdd.item_price"
														v-bind="money"
														class="el-input__inner"></money>
												</div>
											</div>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="Discount">
											<div class="el-form-item__content custom-price-format">
												<div class="el-input">
													<money
														v-model="formsProductAdd.item_discount"
														v-bind="money"
														class="el-input__inner"></money>
												</div>
											</div>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="Qty">
											<el-input-number
												type="number"
												:min="0"
												v-model="formsProductAdd.item_qty"></el-input-number>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="Total">
											Rp. {{formatPrice(formsProductAdd.items_totals)}}
										</el-form-item>
									</el-col>
								</el-row>
								<!-- <pre>{{formsProductAdd}}</pre> -->
							</div>
						</div>
					</el-form>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button round class="button-white-green" @click.prevent="submitModalAdd()" type="primary">Submit</el-button>
				</span>
			</el-dialog>
			<el-dialog
				:title="'Apakah yakin akan menghapus ' + purchaseOrderItemId.length + ' Item Produk?'"
				:visible.sync="deleteItemModal"
				width="45%"
				top="5vh"
				class="mb-dialog nopadding-right point-modal kepala-regional">
				<div class="content-dialog detail-pencapaian">
					<label>Alasan</label>
					<el-input type="textarea" rows="5" v-model="deleteReasonItem"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button round class="button-white-green" @click.prevent="removeProductInputApi(purchaseOrderId, purchaseOrderItemId)" type="primary">Submit</el-button>
				</span>
			</el-dialog>
			<el-dialog
				title="Pilih Produk"
				:visible.sync="modalProduct"
				width="45%"
				top="5vh"
				:close-on-click-modal="false"
				:close-on-press-escape="false"
				class="mb-dialog nopadding-right point-modal kepala-regional">
				<div class="content-dialog detail-pencapaian">
					<el-form :model="formsChooseProduct" status-icon ref="formsvalidproductitem" label-width="120px" class="demo-ruleForm">
						<div class="item-forms-details">
							<div class="forms-details" style="margin-top: 0;">
								<el-row :gutter="20">
									<el-col :span="24">
										<el-form-item label="Tipe">
											<el-radio-group v-model="formsChooseProduct.type">
												<el-radio
													v-for="(dataTypes, indexTypes) in itemsDataType"
													:key="indexTypes"
													@change="
														formsChooseProduct.product_id = '';
														formsChooseProduct.colour_id = '';
														formsChooseProduct.product_name = '';
														formsChooseProduct.colour_name = '';"
													:label="dataTypes.slug">{{dataTypes.name}}</el-radio>
											</el-radio-group>
										</el-form-item>
									</el-col>
									<el-col :span="24"
										v-for="(dataItems, indexItems) in itemsDataProduct"
										:key="indexItems"
										style="margin-bottom: 0;">
										<el-form-item v-if="dataItems.label == 'e-bike' && formsChooseProduct.type == 'e-bike'" label="Produk">
											<el-select
												v-model="formsChooseProduct.product_id"
												@change="
												formsChooseProduct.product_name = searchArray(formsChooseProduct.product_id, dataItems.data).name
												formsChooseProduct.prices_product = searchArray(formsChooseProduct.product_id, dataItems.data).price"
												filterable>
												<el-option
													v-for="(dataProduct, indexProduct) in dataItems.data"
													:key="indexProduct"
													:label="dataProduct.name"
													:value="dataProduct.id">{{dataProduct.name}}</el-option>
											</el-select>
										</el-form-item>
										<el-form-item v-if="dataItems.label == 'spare-parts' && formsChooseProduct.type == 'spare-parts'" label="Produk">
											<el-select
												v-model="formsChooseProduct.product_id"
												@change="
												formsChooseProduct.product_name = searchArray(formsChooseProduct.product_id, dataItems.data).name
												formsChooseProduct.prices_product = searchArray(formsChooseProduct.product_id, dataItems.data).price"
												filterable>
												<el-option
													v-for="(dataProduct, indexProduct) in dataItems.data"
													:key="indexProduct"
													:label="dataProduct.name"
													:value="dataProduct.id">{{dataProduct.name}}</el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="24" style="margin-top: 20px;" v-if="formsChooseProduct.type == 'e-bike'">
										<el-form-item label="Warna">
											<el-select
												v-model="formsChooseProduct.colour_id"
												@change="formsChooseProduct.colour_name = searchArray(formsChooseProduct.colour_id, itemsDataColour).name"
												filterable>
												<el-option
													v-for="(dataColour, indexColour) in itemsDataColour"
													:key="indexColour"
													:label="dataColour.name"
													:value="dataColour.id">{{dataColour.name}}</el-option>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</div>
					</el-form>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button round class="button-white-green" @click.prevent="submitModalChooseProduct(indexForProduct)" type="primary">Submit</el-button>
				</span>
			</el-dialog>
        </div>

		<div class="print-purchase-order" v-if="itemDataPrint.length !== 0">
			<div class="header-print">
				<table>
					<tr>
						<td>
							<h4>Purchase Order</h4>
						</td>
						<td align="right">
							<div class="head-note number">No: {{itemDataPrint.number}}</div>
						</td>
					</tr>
				</table>
			</div>
			<div class="sub-header-print">
				<table border="1">
					<tr>
						<td>
							<div class="to">
								<span class="head">Dari</span> :
								<span class="body">
									<span><b>JARVIS LINTAS MANDIRI</b></span>
								</span>
							</div>
							<div class="address">
								<span class="head">Alamat</span> :
								<span class="body">
									<span v-if="itemDataPrint.warehouse">
										{{itemDataPrint.warehouse.address}}
									</span>
								</span>
							</div>
						</td>
						<td>
							<div class="date">
								<span class="head">Tanggal</span> :
								<span class="body">{{itemDataPrint.created_at | moment('DD-MMM-YYYY')}}</span>
							</div>
							<div class="top">
								<span class="head">TOP</span> :
								<span class="body" v-if="itemDataPrint.payment_method == 'top' || itemDataPrint.payment_method == 'konsinyasi'">
									{{itemDataPrint.payment_method}}, ({{itemDataPrint.termin_payment_date | moment('DD-MMM-YYYY')}})<br>
								</span>
								<span class="body" v-else-if="itemDataPrint.payment_method == 'credit'">
									{{itemDataPrint.payment_method}}, ({{itemDataPrint.credit_term}})<br>
								</span>
								<span class="body" v-else>
									{{itemDataPrint.payment_method}}<br>
								</span>
								(Terms Of Payment)
							</div>
							<div class="note">
								<span class="head">Note</span> :
								<span class="body">{{itemDataPrint.note}}</span>
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div class="sub-header-print">
				<table border="1">
					<tr>
						<td>
							<div class="to">
								<span class="head">Dikirim ke</span> :
								<span class="body">
									<span v-if="itemDataPrint.type == 'store'">
										<span v-if="itemDataPrint.buyer !== ''
													&& itemDataPrint.buyer !== null
													&& itemDataPrint.buyer !== '-'">{{itemDataPrint.buyer}}</span>
										<span v-else>
											<span v-if="itemDataPrint.store">
												{{itemDataPrint.store.name}}
											</span>
										</span>
									</span>
									<span v-else>
										<span>
											{{itemDataPrint.buyer}}
										</span>
									</span>
								</span>
							</div>
							<div class="address">
								<span class="head">Alamat</span> :
								<span class="body">
									<span v-if="itemDataPrint.type == 'store'">
										<span v-if="itemDataPrint.store">
											<span v-if="itemDataPrint.address !== '' && itemDataPrint.address !== null">{{itemDataPrint.address}}<br></span>
											<span v-else>{{itemDataPrint.store.address}}<br></span>
											<span v-if="itemDataPrint.phone !== '' && itemDataPrint.phone !== null">Tlp : {{itemDataPrint.phone}}</span>
											<span v-else>Tlp : {{itemDataPrint.store.phone}}</span>
										</span>
									</span>
									<span v-else>
										<span>
											{{itemDataPrint.address}}<br>
											Tlp : {{itemDataPrint.phone}}
										</span>
									</span>
								</span>
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div class="body-print">
				<table border="1" v-if="itemDataPrintProduct.length !== 0">
					<thead>
						<tr>
							<th class="th-produk" width="450" align="center">Nama Barang</th>
							<th class="th-quantity" width="100" align="center">Quantity</th>
							<th class="th-prices" width="150" align="center">Harga</th>
							<th class="th-discount" width="120" align="center">Discount</th>
							<th class="th-total" width="150" align="right">Total</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(dataProdukTesting, indexProductTesting) in itemDataPrintProduct"
							:key="indexProductTesting">
							<td>Sepeda Listrik {{dataProdukTesting.item_name}} warna {{dataProdukTesting.item_colour}}</td>
							<td>{{dataProdukTesting.item_qtys}} Unit</td>
							<td>Rp. {{formatPrice(dataProdukTesting.item_prices)}}</td>
							<td>Rp. {{formatPrice(dataProdukTesting.item_discount)}}</td>
							<td>
								Rp. {{formatPrice((dataProdukTesting.item_prices * dataProdukTesting.item_qtys) - dataProdukTesting.item_discount)}}
							</td>
						</tr>
					</tbody>
					<!-- <tbody
						v-for="(dataProduk, indexProduk) in itemDataPrintProduct"
						:key="indexProduk">
						<tr
							v-for="(dataProduk2, indexProduk2) in dataProduk.data"
							:key="indexProduk2">
							<td style="padding: 0;" colspan="5">
								<table class="inside-table">
									<tr
										v-for="(dataProduk3, indexProduk3) in dataProduk2.data"
										:key="indexProduk3">
										<td class="product-name">
											<div>Sepeda Listrik {{dataProduk.labelProduct}} warna <span v-if="dataProduk2.labelColour !== undefined">{{dataProduk2.labelColour}}</span></div>
										</td>
										<td class="product-unit">{{dataProduk3.length}} Unit</td>
										<td class="product-prices">
											<div v-if="dataProduk3[0]">
												Rp. {{formatPrice(dataProduk3[0].price)}}
											</div>
										</td>
										<td class="product-discount">
											<div v-if="dataProduk3[0]">
												Rp. {{formatPrice(dataProduk3[0].discount)}}
											</div>
										</td>
										<td class="product-total">
											<div>
												Rp. {{formatPrice((dataProduk3[0].price * dataProduk3.length) - dataProduk3[0].discount)}}
											</div>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</tbody> -->
				</table>
			</div>
			<div class="body-print">
				<table>
					<tr>
						<td style="width: 71%;padding: 0;"></td>
						<td style="padding: 0;">
							<table border="1">
								<tr>
									<td align="left" width="95"><b>Total Unit</b></td>
									<td align="right">
										{{itemDataPrint.total_unit}} Unit
									</td>
								</tr>
								<tr v-if="itemDataPrint.payment_method == 'credit'">
									<td align="left"><b>Down Payment</b></td>
									<td align="right">Rp. {{formatPrice(itemDataPrint.down_payment)}}</td>
								</tr>
								<tr v-if="itemDataPrint.payment_method == 'credit'">
									<td align="left"><b>Biaya Kredit Tambahan</b></td>
									<td align="right">Rp. {{formatPrice(itemDataPrint.additional_credit)}}</td>
								</tr>
								<tr>
									<td align="left"><b>SubTotal</b></td>
									<td align="right">Rp. {{formatPrice(itemDataPrint.subtotal)}}</td>
								</tr>
								<tr>
									<td align="left"><b>Discount</b></td>
									<td align="right">Rp. {{formatPrice(itemDataPrint.discount)}}</td>
								</tr>
								<tr>
									<td align="left"><b>Tax</b></td>
									<td align="right">Rp. {{formatPrice(itemDataPrint.tax)}}</td>
								</tr>
								<tr>
									<td align="left"><b>Total</b></td>
									<td align="right">Rp. {{formatPrice(itemDataPrint.total)}}</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</div>
			<div class="signature-print">
				<table>
					<tr>
						<td>
							Hormat Kami, <br>
							.............................................
							<br><br><br><br><br><br>
							(.............................................)
						</td>
					</tr>
				</table>
			</div>
		</div>
    </div>
</template>

<script>
import {
    faPlusCircle,
	faTrash,
	faEdit,
	faPrint
} from '@fortawesome/free-solid-svg-icons'
import XLSX from 'xlsx'
import {Money} from 'v-money'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

export default {
    name: 'purchase-order',
    components: { pageHeader, loadingSvg, Money },
    data(){
        return{
			sectionApi: "purchaseOrder",
			sectionApiWarehouse: "warehouse",
			sectionApiStore: "store",
			sectionApiItemProduct: "item",
			sectionApiCredit: "creditProvider",
			sectionApiProduct: "product",
			sectionApiTypeProduct: "type",
			sectionApiColourProduct: "colour",
			dateRange: [this.$FUNCTIONS.formatDate(firstDay), this.$FUNCTIONS.formatDate(lastDay)],
			format: 'yyyy-MM-dd',
            limit: 10,
            page: 1,
            loading: false,
			loadingForm: false,
			loadingModal: false,
			loadingExcel: false,
			itemsData: [],
			itemsDataWarehouse: [],
			itemsDataStore: [],
			itemsDataProductItem: [],
			itemsDataCreditProvider: [],
            itemDataDetail: [],
			itemDataPrint: [],
			itemDataPrintProduct: [],
			itemDataExcel: [],
			itemsDataProduct: [],
			itemsDataType: [],
			itemsDataColour: [],
			totalPage: 0,
			filterQuery: " ",
			searchQuery: "",
			storeFilter: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            forms: {
				number_old: "",
				created_at_old: "",
				type_po: "new",
                warehouse: "",
				store: "",
				seller: "",
				buyer: "",
				note: "",
				discount: 0,
				tax: 0,
				subtotal: 0,
				total: 0,
				type: "store",
				payment_method: "top",
				credit_term: "",
				credit_provider: "",
				down_payment: 0,
				add_fee: 0,
				termin_payment_date: "",
				address: "",
				phone: ""
			},
			totalRealData: 0,
            rules: {
				warehouse: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
            },
			formsProduct: [],
			formsProductDisabled: [],
			formsProductAdd:{
				item_tipe: "",
				item_product_id: "",
				item_colour: "",
				item_price: 0,
				item_qty: 1,
				item_discount: 0,
				items_totals: 0,
			},
            dataTextCreate: "Buat Purchase Order",
            dataTextUpdate: "Edit Purchase Order",
            confirmDescDelete: "Anda yakin akan menghapus data Purchase Order dari daftar?",
            confirmTitleDelete: "Hapus Purchase Order",
            textDataCreateSuccess: "Data Purchase Order Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Purchase Order Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
			fontsIcons:{
                plus: faPlusCircle,
				minus: faTrash,
				edit: faEdit,
				print: faPrint
			},
			modalItemAdd: false,
			messageErrorProduct: "",
			datePrint: date,
			deleteItemModal: false,
			deleteReasonItem: "",
			purchaseOrderId: "",
			purchaseOrderItemId: [],
			money: {
                decimal: ',',
                thousands: '.',
                prefix: '',
                suffix: '',
                precision: 0,
                masked: false
			},
			dataPrices: [],
			wareHouseId: "",
			dataIndexDelete: "",
			totalUnit: 0,
			formsChooseProduct: {
				type: "",
				product_id: "",
				product_name: "",
				colour_id: "",
				colour_name: "",
				prices_product: "",
			},
			modalProduct: false,
			indexForProduct: 0,
			dataDetailProdukEdit: [],
			testing: [],
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.purchaseorder.get'])
    },
    mounted(){
		this.getPost()
		this.getPostWarehouse()
		this.getPostStore()
		this.getPostCredit()
		this.getPostType()
		this.getPostColour()
        this.initCreateFunction()
    },
    watch: {
		filterQuery(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
		},
		dateRange: function(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		storeFilter: function(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		deleteItemModal: function(newValue){
			if(newValue == false){
				this.deleteReasonItem = ""
				this.purchaseOrderId = ""
				this.purchaseOrderItemId = ""
			}
		},
		modalItemAdd:function(newValue){
			if(newValue == false){
				this.formsProductAdd.item_tipe = ""
				this.formsProductAdd.item_id = ""
				this.formsProductAdd.item_price = 0
				this.formsProductAdd.item_qty = 1
				this.formsProductAdd.item_discount = 0
				this.formsProductAdd.items_totals = 0
			}
		},
		formsProduct: {
			handler: function (val, oldVal) {
				let dataPrices = []
				let totalQty = []
				val.forEach(function(p, idx){
					p.items_totals = (p.item_prices * p.item_qtys) - (p.item_discount * p.item_qtys)
					dataPrices[idx] = p.items_totals
					totalQty[idx] = Number(p.item_qtys)
				})

				if(dataPrices.length !== 0){
					this.forms.subtotal = dataPrices.reduce(function(total, num){ return total + num }, 0)
					this.totalUnit = totalQty.reduce(function(total, num){ return total + num }, 0)
					this.totalRealData = this.forms.subtotal
				}
			},
			deep: true
		},
		forms: {
			handler: function (val, oldVal) {
				if(val['payment_method'] == 'credit'){
					var dp = Number(val['down_payment'])
					var fee = Number(val['add_fee'])
					var total = Number((val['subtotal'] + val['tax'] + fee) - dp)
					var discount = Number(val['discount'])
					this.totalRealData = total - discount
				}else{
					this.forms.down_payment = 0
					this.forms.add_fee = 0
					var total = Number(val['subtotal'] + val['tax'])
					var discount = Number(val['discount'])
					this.totalRealData = total - discount
				}
			},
			deep: true
		},
		formsProductAdd: {
			handler: function(val, oldVal){
				var price = Number(val['item_price'])
				var discount = Number(val['item_discount'])
				val['items_totals'] = (price * val['item_qty']) - (discount * val['item_qty'])
			},
			deep: true
		},
		totalRealData: function(newValue){},
		modalProduct: function(newValue){
			if(newValue == false){
				this.formsChooseProduct.type = ""
				this.formsChooseProduct.product_id = ""
				this.formsChooseProduct.product_name = ""
				this.formsChooseProduct.colour_id = ""
				this.formsChooseProduct.colour_name = ""
				this.formsChooseProduct.prices_product = ""
			}
		}
    },
    methods:{
        buildUrl(value){
            if(value == true){
				return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&order=created_at&sort=DESC&search=" + this.searchQuery + "&start_date=" + this.dateRange[0] + "&end_date=" + this.dateRange[1] + "&store_id=" + this.storeFilter + "&status=" + this.filterQuery
            }else{
                return this.$baseUrl + this.sectionApi
            }
        },
        async getPost(){
            try{
                this.loading = true
                const response = await this.$services.getList(this.buildUrl(true))
                this.loading = false
                if(response.status == 200){
                    this.itemsData = response.data.data
                    this.totalPage = response.data.pagination.rowCount
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostWarehouse(){
            try{
				let url = this.$baseUrl + this.sectionApiWarehouse + "?limit=100&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsDataWarehouse = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostStore(){
            try{
				let url = this.$baseUrl + this.sectionApiStore + "?limit=100&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsDataStore = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostCredit(){
            try{
				let url = this.$baseUrl + this.sectionApiCredit + "?limit=100&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsDataCreditProvider = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostType(){
            try{
				let url = this.$baseUrl + this.sectionApiTypeProduct + "?limit=100&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
					this.itemsDataType = response.data.data
					this.itemsDataType.forEach(function(e){
						this.getPostProduct(e.id, e.slug)
					}, this)
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostProduct(value, slug){
            try{
                let url = this.$baseUrl + this.sectionApiProduct + "?limit=1000&page=1&type_id=" + value
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsDataProduct.push({
						label: slug,
						data: response.data.data
					})
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
		async getPostItem(slugType){
            try{
				this.loadingForm = true
				let url = this.$baseUrl + this.sectionApiItemProduct + "?limit=1000&page=1&status=warehouse&warehouse_id=" + this.wareHouseId + "&type=" + slugType
				const response = await this.$services.getList(url)
				this.loadingForm = false
                if(response.status == 200){
                    this.itemsDataProductItem.push({
						label: slugType,
						data: response.data.data
					})
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
				this.loadingForm = false
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostColour(){
            try{
                let url = this.$baseUrl + this.sectionApiColourProduct + "?limit=1000&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsDataColour = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
        async postFunction(type, credentials, url) {
            if(type == "post"){
                try{
                    const response = await this.$services.postList(url, credentials)
                    document.getElementById("save").children[0].innerHTML = "Simpan"
                    if(response.status == 201) {
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost()
						this.closeModal()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPost)
                    }
                }catch(err){
					document.getElementById("save").children[0].innerHTML = "Simpan"
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(type == "put"){
                try{
                    const response = await this.$services.putList(url, credentials)
                    document.getElementById("save-edit").children[0].innerHTML = "Simpan"
                    if(response.status == 200) {
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost()
                        this.resetField()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPut)
                    }
                }catch(err){
					document.getElementById("save-edit").children[0].innerHTML = "Simpan"
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if (type == "delete"){
                try{
                    const response = await this.$services.deleteList(url)
                    if(response.status == 200) {
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost()
                        this.resetField()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorDelete)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(type == "detail"){
                try{
                    this.loadingForm = true
                    const response = await this.$services.getList(url)
                    this.loadingForm = false
                    if(response.status == 200){
                        this.itemDataDetail = response.data
                        this.forms.name = this.itemDataDetail.name
                        this.forms.code = this.itemDataDetail.code
                    }else if(response.status == 400){
                        this.$FUNCTIONS.logout("expired-token", this.$textTokenExpired)
                    }else{
                        this.$FUNCTIONS.notify("error", "Error", this.$textNodata)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }
		},
		async getExcel(){
			if(this.itemsData.length != 0){
				try{
					this.loadingExcel = true
					this.limit = this.totalPage
					this.page = 1
					let url = this.buildUrl(true)
					const response = await this.$services.getList(url)
					this.loadingExcel = false
					if(response.status == 200){
						this.itemDataExcel = response.data.data

						let that = this
						setTimeout(function(){
							that.loadingExcel = false
							var wscols = [
								{wch:20},
								{wch:25},
								{wch:30},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
							];
							var datas = XLSX.utils.table_to_sheet(document.getElementById('table-export-purchase-order'))
							datas['!cols'] = wscols;
							var wb = XLSX.utils.book_new()
							let filename = "purchase-order-jarvis"
							XLSX.utils.book_append_sheet(wb, datas, 'Purchase Order')
							XLSX.writeFile(wb, filename+'.xlsx')
						}, 1000)
					}else{
						this.$FUNCTIONS.checkErrorResponse(response.status)
					}
				}catch(err){
					this.loadingExcel = false
					this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
				}
			}else{
				this.$FUNCTIONS.notify('error', 'Maaf', 'Data Kosong')
			}
		},
		searchArray(nameKey, myArray){
            for (var i=0; i < myArray.length; i++) {
                if (myArray[i].id === nameKey) {
                    return myArray[i];
                }
            }
		},
        getResult: _.debounce(function(){
            this.getPost()
        }, 500),
        deletePost(id) {
			if(this.itemDataDetail.status == 'pending'){
				this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
					confirmButtonText: "OK",
					cancelButtonText: "Cancel",
					type: "warning"
				}).then(() => {
					let url = this.buildUrl(false) + "/" + id
					this.postFunction("delete", "", url)
				});
			}else{
				this.$FUNCTIONS.notify('error', 'Error', 'PO sudah dibuatkan surat jalan, tidak dapat di hapus')
			}
        },
        handleCurrentChange(val) {
            if (val) {
				let that = this
				this.titleForms = this.dataTextUpdate
				this.formsType = "edit"
				this.$FUNCTIONS.sidebarToggle(true)
				this.itemDataDetail = val

				if(this.itemDataDetail.warehouse_id !== null){
					this.wareHouseId =  this.itemDataDetail.warehouse_id
				}

				this.forms.warehouse = this.itemDataDetail.warehouse_id
				this.forms.store = this.itemDataDetail.store_id
				this.forms.seller = this.itemDataDetail.seller
				this.forms.buyer = this.itemDataDetail.buyer
				this.forms.note = this.itemDataDetail.note
				this.forms.discount = this.itemDataDetail.discount
				this.forms.tax = this.itemDataDetail.tax
				this.forms.subtotal = this.itemDataDetail.subtotal
				this.forms.type = this.itemDataDetail.type
				this.forms.payment_method = this.itemDataDetail.payment_method
				this.forms.credit_term = this.itemDataDetail.credit_term
				this.forms.down_payment = this.itemDataDetail.down_payment

				this.forms.phone = this.itemDataDetail.phone
				this.forms.address = this.itemDataDetail.address
				if(this.itemDataDetail.termin_payment_date !== null){
					this.forms.termin_payment_date = this.$FUNCTIONS.formatDate(this.itemDataDetail.termin_payment_date)
				}else{
					this.forms.termin_payment_date = ""
				}

				this.forms.credit_provider = this.itemDataDetail.credit_provider_id
				this.forms.add_fee = this.itemDataDetail.additional_credit
				this.totalUnit = this.itemDataDetail.total_unit

				let result = _(val.details).groupBy('product.name').map((v, labelProduct) => ({
					labelProduct,
					data: _(v).groupBy('colour.name').map((vv, labelColour) => ({
						labelColour,
						data: _(vv).groupBy('price').map((vvv) => ({
							data: _.groupBy(vvv, 'discount')
						})).value()
					})).value()
				})).value()

				this.dataDetailProdukEdit = result
				let pricesItem = []

				this.dataDetailProdukEdit.forEach(function(productName){
					// console.log(productName.labelProduct)
					productName.data.forEach(function(colourName){
						// console.log(colourName.labelColour)
						colourName.data.forEach(function(pricesLabel){
							for(let discountLabel in pricesLabel.data){
								let dataId = []
								// console.log(pricesLabel.data[discountLabel])
								pricesLabel.data[discountLabel].forEach(function(e, i){
									dataId.push(e.id)
								})

								that.formsProduct.push({
									item_name: productName.labelProduct,
									item_colour: colourName.labelColour,
									item_prices: pricesLabel.data[discountLabel][0].price,
									item_qtys: pricesLabel.data[discountLabel].length,
									item_add: false,
									item_discount: pricesLabel.data[discountLabel][0].discount,
									items_ids: dataId
								})
							}
						})
					})
				})

				setTimeout(function(){
					that.totalRealData = that.itemDataDetail.total
				}, 500)
            }
        },
        submitSave(formName, formtype) {
            let loadingform = this.$FUNCTIONS.svgSpinner
            this.messagesuccess = ""
			this.messageerror = ""

            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(formtype == "save") {
						let dataProductId = []
						let dataColourId = []
						let dataItemQty = []
						let dataItemPrice = []
						let dataItemDiscount = []
						let dataErrorItem = []
						let dataValue = {}
						let numberOld = ""
						let createdAtOld = ""

						this.formsProduct.forEach(function(e){
							if(e.item_qtys >= 0){
								for(var i = 0;i<e.item_qtys;i++){
									if(e.item_ids !== ''){
										dataProductId.push(e.item_product_ids)
									}else{
										dataErrorItem.push('error')
									}
									dataColourId.push(e.item_colour_ids)
									dataItemQty.push(1)
									dataItemPrice.push(e.item_prices)
									dataItemDiscount.push(e.item_discount)
								}
							}
						})

						if(this.forms.type_po == "old"){
							dataValue['number'] = this.forms.number_old
							dataValue['created_at'] = this.forms.created_at_old
						}
						dataValue['warehouse_id'] = this.forms.warehouse
						dataValue['store_id'] = this.forms.store
						dataValue['seller'] = this.forms.seller
						dataValue['buyer'] = this.forms.buyer
						dataValue['note'] = this.forms.note
						dataValue['discount'] = this.forms.discount
						dataValue['tax'] = this.forms.tax
						dataValue['subtotal'] = this.forms.subtotal
						dataValue['total'] = this.totalRealData
						dataValue['type'] = this.forms.type
						dataValue['payment_method'] = this.forms.payment_method
						dataValue['credit_term'] = this.forms.credit_term
						dataValue['down_payment'] = this.forms.down_payment
						dataValue['phone'] = this.forms.phone
						dataValue['address'] = this.forms.address
						if(this.forms.payment_method == 'top' || this.forms.payment_method == 'konsinyasi'){
							if(this.forms.termin_payment_date !== ''){
								dataValue['termin_payment_date'] = this.forms.termin_payment_date
							}
						}
						if(this.forms.payment_method == 'credit'){
							dataValue['additional_credit'] = this.forms.add_fee
							dataValue['credit_provider_id'] = this.forms.credit_provider
						}
						dataValue['product_ids'] = dataProductId
						dataValue['colour_ids'] = dataColourId
						dataValue['item_prices'] = dataItemPrice
						dataValue['item_qtys'] = dataItemQty
						dataValue['item_discounts'] = dataItemDiscount
						dataValue['total_unit'] = this.totalUnit

						if(dataErrorItem.length == 0){
							document.getElementById("save").children[0].innerHTML = loadingform
							this.postFunction("post", dataValue, this.buildUrl(false))
						}else{
							this.$FUNCTIONS.notify('error', 'Error', 'Item Produk Kosong, hapus item jika tidak ingin menginputkan produk item')
						}
                    }else{
						let dataValue = {}
						// for data info
						dataValue['warehouse_id'] = this.forms.warehouse
						if(this.forms.type !== 'user'){
							dataValue['store_id'] = this.forms.store
						}else{
							dataValue['store_id'] = ''
						}
						dataValue['seller'] = this.forms.seller
						dataValue['buyer'] = this.forms.buyer
						dataValue['note'] = this.forms.note
						dataValue['discount'] = this.forms.discount
						dataValue['tax'] = this.forms.tax
						dataValue['subtotal'] = this.forms.subtotal
						dataValue['total'] = this.totalRealData
						dataValue['type'] = this.forms.type
						dataValue['payment_method'] = this.forms.payment_method
						dataValue['credit_term'] = this.forms.credit_term
						dataValue['down_payment'] = this.forms.down_payment
						dataValue['phone'] = this.forms.phone
						dataValue['address'] = this.forms.address
						dataValue['total_unit'] = this.totalUnit
						if(this.forms.payment_method == 'top' || this.forms.payment_method == 'konsinyasi'){
							if(this.forms.termin_payment_date !== ''){
								dataValue['termin_payment_date'] = this.forms.termin_payment_date
							}
						}
						if(this.forms.payment_method == 'credit'){
							dataValue['additional_credit'] = this.forms.add_fee
							dataValue['credit_provider_id'] = this.forms.credit_provider
						}

						document.getElementById("save-edit").children[0].innerHTML = loadingform
                        let urlv = this.buildUrl(false) + "/" + this.itemDataDetail.id
						this.postFunction("put", dataValue, urlv)
                    }
                }
            })
        },
        initCreateFunction() {
            let that = this
            setTimeout(function() {
                document.querySelector(".add-click-forms").addEventListener("click", function() {
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = "create"
                        that.$FUNCTIONS.sidebarToggle(true)
                    }else{
                        that.$FUNCTIONS.notify('warning', 'Maaf', that.$textMemuatData)
                    }
                })
            }, 500)
        },
		resetField(row){
			this.$FUNCTIONS.sidebarToggle(false)
			this.$refs.singleTable.setCurrentRow(row)
			// this.$refs.formsvalid.resetFields()
			this.forms.type_po = "new"
			this.forms.number_old = ""
			this.forms.created_at_old = ""
			this.forms.warehouse = ""
			this.forms.store = ""
			this.forms.seller = ""
			this.forms.buyer = ""
			this.forms.note = ""
			this.forms.discount = 0
			this.forms.tax = 0
			this.forms.subtotal = 0
			this.totalRealData = 0
			this.forms.type = "store"
			this.forms.payment_method = "top"
			this.forms.credit_term = ""
			this.forms.credit_provider = ""
			this.forms.down_payment = 0
			this.forms.add_fee = 0
			this.forms.termin_payment_date = ""
			this.forms.address = ""
			this.forms.phone = ""
			this.formsProduct = []
			this.formsProductDisabled = []
			this.itemsDataProductItem = []
			this.dataIndexDelete = ""
			this.totalUnit = 0
			this.dataDetailProdukEdit = []
		},
        closeModal(row) {
			if(this.formsType == 'create'){
				this.resetField()
			}else{
				this.$confirm("Saat anda klik OK, maka perubahan tidak akan tersimpan.", "Apakah Anda Yakin?", {
					confirmButtonText: "OK",
					cancelButtonText: "Cancel",
					type: "warning"
				}).then(() => {
					this.resetField()
				});
			}
        },
        limitChange(limit){
            this.limit = limit
            this.$FUNCTIONS.checkPaginations()
            this.getPost()
            this.$FUNCTIONS.viewActive()
        },
        pageChange(page){
            this.page = page
            this.getPost()
		},
		formatPrice(val){
			return this.$FUNCTIONS.formatPrice(val)
		},
		formatDate(val){
            return this.$FUNCTIONS.formatDate(val)
        },
        formatTime(val){
            return this.$FUNCTIONS.formatTimeUTC(val)
		},
		removeProductInput(index){
			this.formsProduct.splice(index, 1)
			this.formsProductDisabled.splice(index, 1)
			this.totalUnit = this.formsProduct.length
		},
		addRow(){
			// if(this.forms.warehouse !== ""){
				this.formsProduct.push({
					type_product: '',
					item_real: '',
					item_product_ids: '',
					item_product_names: '',
					item_colour_ids: '',
					item_colour_names: '',
					item_prices: '',
					item_qtys: 1,
					item_add: true,
					item_discount: 0,
					items_totals: 0,
				})
				this.formsProductDisabled.push({
					item_ids: false,
					item_prices: false,
					item_qtys: true,
					item_discount: false,
				})
				// this.totalUnit = this.formsProduct.length
			// }else{
			// 	this.$FUNCTIONS.notify('info', 'Info', 'Pilih Warehouse Terlebih dahulu')
			// }
		},
		removeProductInputApi(idPurchaseOrder, idItem){
			if(this.itemDataDetail.status == 'pending'){
				this.$confirm("Apa anda yakin untuk menghapus " + idItem.length + " item dari daftar?", "Delete Item Purchase Order", {
					confirmButtonText: "OK",
					cancelButtonText: "Cancel",
					type: "warning"
				}).then(() => {
					idItem.forEach(function(e, i){
						let url = this.buildUrl(false) + "/item/" + idPurchaseOrder + '/' + e
						this.deleteItemModal = false
						this.loadingForm = true
						this.axios.put(url, {
							delete_reason: this.deleteReasonItem
						})
						.then((response) => {
							this.loadingForm = false
							if(response.status == 200){
								if(i+1 == idItem.length){
									this.deleteItemModal = false
									this.removeProductInput(this.dataIndexDelete)
									// setTimeout(function(){
									// 	document.getElementById('save-edit').click()
									// }, 200)
								}
							}else{
								this.$FUNCTIONS.notify('error', 'Error', this.$textErrorDelete)
							}
						}).catch((err) => {
							this.loadingForm = false
							this.$FUNCTIONS.notify('error', 'Error', 'Item tidak berhasil dihapus')
						})
					}, this)
				});
			}else{
				this.$FUNCTIONS.notify('Error', 'error', 'Item tidak dapat dihapus karena sudah ada disurat jalan')
			}
		},
		async submitModalAdd(){
			this.messageErrorProduct = ""
			if(this.formsProductAdd.item_id == "" &&
				this.formsProductAdd.item_price == "" &&
				this.formsProductAdd.item_qty == "" &&
				this.formsProductAdd.item_discount == ""){
				this.messageErrorProduct = "Mohon Lengkapi data dibawah ini!"
			}else{
				let url = this.buildUrl(false) + "/item/" + this.itemDataDetail.id
				let nameProduct, colorName

				colorName = this.searchArray(this.formsProductAdd.item_colour, this.itemsDataColour)
				this.itemsDataProduct.forEach(function(e){
					let checkDataProduct = this.searchArray(this.formsProductAdd.item_product_id, e.data)
					if(checkDataProduct !== undefined){
						nameProduct = checkDataProduct.name
					}
				}, this)

				try{
					this.loadingModal = true
					const response = await this.$services.postList(url, {
						product_id: this.formsProductAdd.item_product_id,
						colour_id: this.formsProductAdd.item_colour,
						item_price: this.formsProductAdd.item_price,
						item_qty: this.formsProductAdd.item_qty,
						item_discount: this.formsProductAdd.item_discount,
					})
					this.loadingModal = false
                    if(response.status == 201) {
						this.messagesuccess = "Penambahan Data Item Berhasil"
						let datasRespon = response.data
						let dataId = []
						let that = this

						datasRespon.forEach(function(e, i){
							dataId.push(e.id)
							if((i + 1) == datasRespon.length){
								that.formsProduct.push({
									item_name: nameProduct,
									item_colour: colorName.name,
									item_prices: that.formsProductAdd.item_price,
									item_qtys: that.formsProductAdd.item_qty,
									item_add: false,
									item_discount: that.formsProductAdd.item_discount,
									items_ids: dataId
								})
							}
						})

						this.modalItemAdd = false
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPost)
                    }
                }catch(err){
					this.loadingModal = false
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
			}
		},
		printPO(val){
			let that = this
			this.itemDataPrint = val
			let result = _(val.details).groupBy('product.name').map((v, labelProduct) => ({
				labelProduct,
				data: _(v).groupBy('colour.name').map((vv, labelColour) => ({
					labelColour,
					data: _(vv).groupBy('price').map((vvv) => ({
						data: _.groupBy(vvv, 'discount')
					})).value()
				})).value()
			})).value()

			this.itemDataPrintProduct = []

			result.forEach(function(productName){
				productName.data.forEach(function(colourName){
					colourName.data.forEach(function(pricesLabel){
						for(let discountLabel in pricesLabel.data){
							that.itemDataPrintProduct.push({
								item_name: productName.labelProduct,
								item_colour: colourName.labelColour,
								item_prices: pricesLabel.data[discountLabel][0].price,
								item_qtys: pricesLabel.data[discountLabel].length,
								item_discount: pricesLabel.data[discountLabel][0].discount,
							})
						}
					})
				})
			})

			this.loading = true
			setTimeout(function(){
				that.loading = false
				window.print()
			}, 1000)
		},
		wareHouseItemChange(val){
			this.wareHouseId = val
			// this.itemsDataProductItem = []
			// this.getPostItem('bike')
			// this.getPostItem('sparepart')
			// this.formsProduct = []
			// this.formsProductDisabled = []
		},
		storeChange(val){
			let datas = this.searchArray(val, this.itemsDataStore)
			let checkDataPIC = (datas.pic == '' || datas.pic == null) ? this.forms.buyer = '-' : this.forms.buyer = datas.pic
			let checkDataPhone = (datas.phone == '' || datas.phone == null || datas.phone == 'null') ? this.forms.phone = '-' : this.forms.phone = datas.phone
			let checkDataAddress = (datas.address == '' || datas.address == null || datas.address == 'null') ? this.forms.address = '-' : this.forms.address = datas.address
		},
		submitModalChooseProduct(index){
			let that = this
			this.formsProduct[index].type_product = this.formsChooseProduct.type
			this.formsProduct[index].item_product_ids = this.formsChooseProduct.product_id
			this.formsProduct[index].item_product_names = this.formsChooseProduct.product_name
			this.formsProduct[index].item_colour_ids = this.formsChooseProduct.colour_id
			this.formsProduct[index].item_colour_names = this.formsChooseProduct.colour_name
			this.formsProduct[index].item_prices = this.formsChooseProduct.prices_product
			this.modalProduct = false

			setTimeout(function(){
				that.formsChooseProduct.type = ''
				that.formsChooseProduct.product_id = ''
				that.formsChooseProduct.product_name = ''
				that.formsChooseProduct.colour_id = ''
				that.formsChooseProduct.colour_name = ''
				that.formsChooseProduct.prices_product = ''
			}, 200)
		}
	}
}
</script>
<style lang="scss" scoped>
.print-purchase-order{
	display: none;
}
.plus-items{
    position: absolute;
    right: -15px;
    z-index: 10;
    top: -10px;
    .fontIcons{
        font-size: 24px;
        color: #800080 !important;
    }
}
.minus-items{
    .fontIcons{
        font-size: 16px !important;
        color: #800080 !important;
    }
}
@media print {
	#purchase-order{
		display: none;
	}
	.print-purchase-order{
		display: block;
		padding: 15px 45px;
		table{
			width: 100%;
			td{
				vertical-align: top;
			}
		}
		.header-print{
			margin-bottom: 10px;
			table{
				font-size: 12px;
				td{
					img{
						max-width: 135px !important;
    					width: 100%;
					}
				}
			}
		}
		.sub-header-print{
			margin-bottom: 15px;
			table{
				font-size: 10px;
				td{
					padding: 2px 4px;
					.date, .top, .note{
						margin-bottom: 2px;
						.head{
							width: 45px;
							display: inline-block;
							vertical-align: top;
						}
						.body{
							margin-left: 5px;
						}
					}
					.to, .address{
						.head{
							width: 50px;
							display: inline-block;
							vertical-align: top;
						}
						.body{
							margin-left: 5px;
							width: 65%;
							display: inline-block;
							vertical-align: top;
						}
					}
					.to{
						margin-bottom: 2px;
					}
				}
			}
		}
		.body-print{
			margin-bottom: 15px;
			table{
				font-size: 10px;
				.inside-table{
					tr{
						border-bottom: 1px solid #2c2c2c;
						&:last-child{
							border-bottom: none;
						}
						td{
							padding: 0;
							border-right: 1px solid #2c2c2c;
							padding: 2px 4px;
							&:last-child{
								border-right: 0;
							}
							&.product-name{
								width: 43%;
							}
							&.product-unit{
								width: 13.2%;
							}
							&.product-prices{
								width: 15%;
							}
							&.product-discount{
								width: 14.6%;
							}
						}
					}
				}
				th{
					padding: 2px 4px;
					&:first-child{
						text-align: center;
					}
					&.th-produk{
						width: 43%;
					}
					&.th-quantity{
						width: 13.2%;
					}
					&.th-prices{
						width: 15%;
					}
					&.th-discount{
						width: 14.6%;
					}
				}
				td{
					padding: 2px 4px;
				}
			}
		}
		.signature-print{
			table{
				font-size: 10px;
			}
		}
	}
}
</style>
